import { Role } from './auth.model';

export interface ManagedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  enabled: boolean;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  clientId?: number | null;
  assignedClientIds?: number[];
}
