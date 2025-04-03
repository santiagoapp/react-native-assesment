import { API_BASE_URL } from '@/constants/Config';
import { AuthTokens, LoginCredentials, TokenRefreshResponse, TokenVerifyResponse } from '@/types/auth';
import { apiClient } from '@/utils/apiClient';
import { tokenRefresher } from '@/utils/tokenRefresher';

/**
 * Service for handling authentication operations
 */
export const authService = {
  /**
   * Login with email and password
   * @param credentials User credentials
   * @returns Authentication tokens
   */
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    try {
      // Use direct fetch here instead of apiClient to avoid auth requirements
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Login failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Refresh the access token using a refresh token
   * @param refreshToken The refresh token
   * @returns New access token
   */
  refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    // Delegate to the tokenRefresher utility
    return tokenRefresher.refreshToken(refreshToken);
  },

  /**
   * Verify if an access token is valid
   * @param accessToken The access token to verify
   * @returns Verification response
   */
  verifyToken: async (accessToken: string): Promise<TokenVerifyResponse> => {
    try {
      // Use direct fetch to avoid authentication requirements
      const response = await fetch(`${API_BASE_URL}/token/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: accessToken }),
      });

      if (!response.ok) {
        throw new Error(`Token verification failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  },

  /**
   * Get the current user profile
   * @returns User profile data
   */
  getCurrentUser: async () => {
    return apiClient.get('/users/me/');
  },

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Registration response
   */
  register: async (userData: {
    email: string;
    password: string;
    re_password: string;
    first_name?: string;
    last_name?: string;
  }) => {
    return apiClient.post('/auth/users/', userData, { requireAuth: false });
  },
};