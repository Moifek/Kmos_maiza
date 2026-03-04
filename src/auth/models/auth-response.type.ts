import type { UserRole } from '../../shared/types/user-role.type';

export interface AuthResponse {
  readonly accessToken: string;
  readonly user: AuthUserPayload;
}

export interface AuthUserPayload {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly role: UserRole;
  readonly locationId?: string;
}
