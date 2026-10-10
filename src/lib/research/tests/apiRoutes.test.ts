import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getRuns, POST as createRun } from '@/app/api/research/route';
import { GET as getSingleRun } from '@/app/api/research/[id]/route';
import { POST as cancelRun } from '@/app/api/research/[id]/cancel/route';
import { researchHistory } from '@/lib/research/researchHistory';

describe('Phase 14: Research REST API Endpoints', () => {
  beforeEach(() => {
    researchHistory.clear();
  });

  it('GET /api/research should list research runs for authorized roles', async () => {
    const req = new NextRequest('http://localhost:3000/api/research', {
      headers: { 'x-user-role': 'ANALYST' }
    });
    const res = await getRuns(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data.runs)).toBe(true);
  });

  it('GET /api/research should reject unauthorized role lacking VIEW_EVENTS', async () => {
    // There are no roles without VIEW_EVENTS in default mapping, but invalid role will fail
    const req = new NextRequest('http://localhost:3000/api/research', {
      headers: { 'x-user-role': 'INVALID_ROLE' as any }
    });
    const res = await getRuns(req);
    expect(res.status).toBe(403);
  });

  it('POST /api/research should enforce EDIT_INVESTIGATIONS and validate inputs', async () => {
    // 1. Rejects invalid short question
    const reqInvalid = new NextRequest('http://localhost:3000/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'ANALYST' },
      body: JSON.stringify({ question: 'hi' })
    });
    const resInvalid = await createRun(reqInvalid);
    expect(resInvalid.status).toBe(400);

    // 2. Rejects unauthorized VIEWER role (lacks EDIT_INVESTIGATIONS)
    const reqViewer = new NextRequest('http://localhost:3000/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'VIEWER' },
      body: JSON.stringify({ question: 'What is happening with AI models?' })
    });
    const resViewer = await createRun(reqViewer);
    expect(resViewer.status).toBe(403);
  });

  it('GET /api/research/[id] and POST /api/research/[id]/cancel should manage run lifecycle', async () => {
    // Seed an in-progress run
    const testRunId = 'test-run-lifecycle-1';
    researchHistory.saveRun({
      id: testRunId,
      question: 'Lifecycle testing question for deep research?',
      userId: 'user-1',
      workspaceId: 'workspace-default',
      organizationId: 'org-1',
      status: 'EXECUTING',
      tasks: [],
      findings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: new Date().toISOString()
    });

    // 1. Fetch single run
    const reqGet = new NextRequest(`http://localhost:3000/api/research/${testRunId}`, {
      headers: { 'x-user-role': 'ANALYST' }
    });
    const resGet = await getSingleRun(reqGet, { params: Promise.resolve({ id: testRunId }) });
    expect(resGet.status).toBe(200);
    const dataGet = await resGet.json();
    expect(dataGet.run.id).toBe(testRunId);

    // 2. Cancel run
    const reqCancel = new NextRequest(`http://localhost:3000/api/research/${testRunId}/cancel`, {
      method: 'POST',
      headers: { 'x-user-role': 'ANALYST' }
    });
    const resCancel = await cancelRun(reqCancel, { params: Promise.resolve({ id: testRunId }) });
    expect(resCancel.status).toBe(200);
    const dataCancel = await resCancel.json();
    expect(dataCancel.success).toBe(true);
    expect(dataCancel.run.status).toBe('CANCELLED');
  });
});
