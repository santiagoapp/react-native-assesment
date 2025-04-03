import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokens } from '@/types/auth';

const AUTH_TOKENS_KEY = 'auth_tokens';

export const authStorage = {
  /**
   * Store authentication tokens in AsyncStorage
   */
  storeTokens: async (tokens: AuthTokens): Promise<void> => {
    try {
      await AsyncStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Error storing auth tokens:', error);
      throw error;
    }
  },

  /**
   * Get authentication tokens from AsyncStorage
   */
  getTokens: async (): Promise<AuthTokens | null> => {
    try {
      const tokensString = await AsyncStorage.getItem(AUTH_TOKENS_KEY);
      return tokensString ? JSON.parse(tokensString) : null;
    } catch (error) {
      console.error('Error getting auth tokens:', error);
      return null;
    }
  },

  /**
   * Remove authentication tokens from AsyncStorage
   */
  removeTokens: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKENS_KEY);
    } catch (error) {
      console.error('Error removing auth tokens:', error);
      throw error;
    }
  },
};