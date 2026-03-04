import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../../shared/types/user-role.type';

export const ROLES_KEY = 'roles';

/** Sets required roles for a route handler. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
