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

export interface AuthState {
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}