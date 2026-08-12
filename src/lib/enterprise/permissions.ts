import { ROLE_PERMISSIONS_MAP } from './roles';
import { Permission, Role } from './types';

/**
 * Centralized RBAC guard checking if a given Role holds a required Permission.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const allowed = ROLE_PERMISSIONS_MAP[role] || [];
  return allowed.includes(permission);
}

/**
 * Asserts that a role holds a permission, throwing an error if unauthorized.
 */
export function assertPermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Unauthorized: Role '${role}' lacks required permission '${permission}'.`);
  }
}
