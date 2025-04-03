import { API_BASE_URL } from '@/constants/Config';
import { authStorage } from './authStorage';
import { tokenRefresher } from './tokenRefresher';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
  skipRefreshToken?: boolean;
}

/**
 * API client for making authenticated requests
 */
export const apiClient = {
  /**
   * Make a request to the API
   */
  request: async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    const { requireAuth = true, skipRefreshToken = false, ...fetchOptions } = options;
    
    // Set default headers
    const headers = new Headers(fetchOptions.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Add auth token if required
    if (requireAuth) {
      const tokens = await authStorage.getTokens();
      if (!tokens) {
        throw new Error('Authentication required');
      }
      
      headers.set('Authorization', `Bearer ${tokens.access}`);
    }
    
    // Make the request
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
      });
      
      // Handle 401 Unauthorized - try to refresh token and retry
      if (response.status === 401 && requireAuth && !skipRefreshToken) {
        const tokens = await authStorage.getTokens();
        if (!tokens?.refresh) {
          throw new Error('Authentication required');
        }
        
        try {
          // Try to refresh the token
          const refreshResult = await tokenRefresher.refreshToken(tokens.refresh);
          
          // Update stored tokens
          await authStorage.storeTokens({
            ...tokens,
            access: refreshResult.access,
          });
          
          // Retry the request with the new token
          return apiClient.request<T>(endpoint, {
            ...options,
            skipRefreshToken: true, // Prevent infinite refresh loops
          });
        } catch (refreshError) {
          // If refresh fails, clear tokens and throw auth error
          await authStorage.removeTokens();
          throw new Error(`Authentication expired: ${refreshError}`);
        }
      }
      
      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }
      
      // Parse and return the response
      return await response.json();
    } catch (error) {
      console.error(`API request error for ${endpoint}:`, error);
      throw error;
    }
  },
  
  /**
   * Shorthand for GET requests
   */
  get: <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    return apiClient.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  },
  
  /**
   * Shorthand for POST requests
   */
  post: <T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> => {
    return apiClient.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Shorthand for PUT requests
   */
  put: <T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> => {
    return apiClient.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Shorthand for DELETE requests
   */
  delete: <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    return apiClient.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },
};