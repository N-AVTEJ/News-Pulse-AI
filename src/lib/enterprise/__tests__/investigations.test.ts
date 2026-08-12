import { describe, it, expect } from 'vitest';
import { createInvestigation, updateInvestigationStatus, attachEvidenceToInvestigation } from '../investigations';

describe('Investigation Lifecycle Engine', () => {

  it('creates investigation with OPEN status and attaches evidence', () => {
    const inv = createInvestigation(
      'Test Semiconductor Investigation',
      'Tracking datacenter GPU supply',
      'HIGH',
      'mem_analyst_01',
      ['mem_analyst_01'],
      ['Semiconductors']
    );

    expect(inv.status).toBe('OPEN');
    expect(inv.priority).toBe('HIGH');

    const updated = attachEvidenceToInvestigation(inv.id, 'evt_001');
    expect(updated.evidenceCount).toBe(1);
    expect(updated.clusterIds).toContain('evt_001');
  });

  it('transitions investigation status properly', () => {
    const inv = createInvestigation('State Transition Test', 'Desc');
    const active = updateInvestigationStatus(inv.id, 'ACTIVE');
    expect(active.status).toBe('ACTIVE');

    const completed = updateInvestigationStatus(inv.id, 'COMPLETED');
    expect(completed.status).toBe('COMPLETED');
  });

});
