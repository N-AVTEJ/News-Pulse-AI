import { describe, it, expect } from 'vitest';
import { resolveEntity } from '../entityResolver';

describe('Deterministic Entity Resolver', () => {

  it('normalizes entity variations to canonical name while preserving aliases', () => {
    const res1 = resolveEntity('OpenAI Inc.');
    expect(res1.canonicalName).toBe('OpenAI');
    expect(res1.type).toBe('COMPANY');
    expect(res1.aliases).toContain('OpenAI Inc.');

    const res2 = resolveEntity('Open AI');
    expect(res2.canonicalName).toBe('OpenAI');
  });

  it('preserves clean names for unregistered entities without merging', () => {
    const res = resolveEntity('Acme Quantum Corp.');
    expect(res.canonicalName).toBe('Acme Quantum');
    expect(res.entityId).toBe('ent_acme_quantum');
  });

});
