import { NextRequest, NextResponse } from 'next/server';
import { createWorkflow, executeWorkflow, getWorkflowExecutions, getWorkflows } from '@/lib/platform/workflow/engine';

export async function GET() {
  const workflows = getWorkflows();
  const executions = getWorkflowExecutions();
  return NextResponse.json({
    workflowsCount: workflows.length,
    workflows,
    executionsCount: executions.length,
    executions
  }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.executeWorkflowId) {
      const execution = executeWorkflow(body.executeWorkflowId, body.payload);
      return NextResponse.json({ execution }, { status: 200 });
    }

    const workflow = createWorkflow(
      body.name || 'Untitled Workflow',
      body.description || 'Custom platform workflow automation',
      body.nodes || [],
      body.edges || []
    );

    return NextResponse.json({ workflow }, { status: 201 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown workflows v1 API error';
    return NextResponse.json(
      { error: 'Failed to process workflow request.', details: errorMsg },
      { status: 500 }
    );
  }
}
