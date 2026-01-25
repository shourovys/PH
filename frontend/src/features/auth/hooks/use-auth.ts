import { useCallback } from 'react';

import { authSelectors, useAuthStore, type User } from '../store/auth.store';

/**
 * Return type for the useAuth hook
 */
interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

/**
 * Custom hook for authentication operations
 * Provides a clean API for accessing auth state and actions
 */
export function useAuth(): UseAuthReturn {
  const user = useAuthStore(authSelectors.user);
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);
  const isLoading = useAuthStore(authSelectors.isLoading);
  const error = useAuthStore(authSelectors.error);

  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);

  /**
   * Login function
   * In a real app, this would call an API endpoint
   */
  const login = useCallback(
    async (email: string, _password: string): Promise<User> => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const namePart = email.split('@')[0];
        const user: User = {
          id: '1',
          email,
          name: namePart || 'User',
          role: 'user',
        };

        setUser(user);
        localStorage.setItem('auth_token', 'mock-token');

        return user;
      } catch {
        const errorMessage = 'Login failed. Please check your credentials.';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError]
  );

  /**
   * Logout function
   * Clears user state and removes auth token
   */
  const logout = useCallback(() => {
    clearUser();
    localStorage.removeItem('auth_token');
  }, [clearUser]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    (updates: Partial<User>) => {
      if (user) {
        setUser({ ...user, ...updates });
      }
    },
    [user, setUser]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
  };
}
