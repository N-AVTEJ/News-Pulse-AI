import { describe, it, expect } from 'vitest';
import { hasPermission, assertPermission } from '../permissions';

describe('RBAC Permission System', () => {

  it('allows OWNER and ADMIN to perform manage members and manage organization actions', () => {
    expect(hasPermission('OWNER', 'MANAGE_ORGANIZATION')).toBe(true);
    expect(hasPermission('OWNER', 'MANAGE_MEMBERS')).toBe(true);
    expect(hasPermission('ADMIN', 'MANAGE_MEMBERS')).toBe(true);
  });

  it('denies ANALYST and VIEWER from managing organization or members', () => {
    expect(hasPermission('ANALYST', 'MANAGE_ORGANIZATION')).toBe(false);
    expect(hasPermission('ANALYST', 'MANAGE_MEMBERS')).toBe(false);
    expect(hasPermission('VIEWER', 'EDIT_INVESTIGATIONS')).toBe(false);
  });

  it('throws authorization error on assertPermission failure', () => {
    expect(() => assertPermission('GUEST', 'EDIT_INVESTIGATIONS')).toThrow(/Unauthorized/);
  });

});
