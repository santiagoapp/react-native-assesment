import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, AuthTokens, LoginCredentials } from '@/types/auth';
import { authService } from '@/services/authService';
import { authStorage } from '@/utils/authStorage';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
}

const initialState: AuthState = {
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Load tokens from storage on app start
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const tokens = await authStorage.getTokens();
        if (tokens) {
          // Verify the access token
          try {
            await authService.verifyToken(tokens.access);
            setState({
              tokens,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            // Token might be expired, try to refresh
            try {
              const refreshResult = await authService.refreshToken(tokens.refresh);
              const updatedTokens = {
                ...tokens,
                access: refreshResult.access,
              };
              await authStorage.storeTokens(updatedTokens);
              setState({
                tokens: updatedTokens,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } catch (refreshError) {
              // Refresh token is also invalid, clear everything
              await authStorage.removeTokens();
              setState({
                tokens: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            }
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setState({
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to load authentication state',
        });
      }
    };

    loadTokens();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const tokens = await authService.login(credentials);
      await authStorage.storeTokens(tokens);
      setState({
        tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await authStorage.removeTokens();
      setState({
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Logout failed',
      }));
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    if (!state.tokens?.refresh) return false;

    try {
      const refreshResult = await authService.refreshToken(state.tokens.refresh);
      const updatedTokens = {
        ...state.tokens,
        access: refreshResult.access,
      };
      await authStorage.storeTokens(updatedTokens);
      setState(prev => ({
        ...prev,
        tokens: updatedTokens,
        isAuthenticated: true,
        error: null,
      }));
      return true;
    } catch (error) {
      // If refresh fails, log the user out
      await logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};