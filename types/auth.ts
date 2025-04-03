export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}

export interface TokenVerifyResponse {
  detail: string;
  code: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserRole {
  id: number;
  name: string;
}

export interface UserPermission {
  id: number;
  codename: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  roles: UserRole[];
  permissions: UserPermission[];
}

export interface AuthState {
  tokens: AuthTokens | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
