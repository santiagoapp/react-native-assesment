import { API_BASE_URL } from '@/constants/Config';
import { TokenRefreshResponse } from '@/types/auth';

/**
 * Utility for refreshing authentication tokens
 */
export const tokenRefresher = {
  /**
   * Refresh the access token using a refresh token
   * @param refreshToken The refresh token
   * @returns New access token
   */
  refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    try {
      // Use direct fetch to avoid authentication requirements
      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },
};