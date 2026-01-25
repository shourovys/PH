import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '../store/auth.store';

import { PrivateRouteGuard } from './PrivateRouteGuard';

vi.mock('../store/auth.store', () => ({
  useAuthStore: vi.fn(),
}));

describe('PrivateRouteGuard', () => {
  it('should render children when user is authenticated', () => {
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector({
        user: null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        setUser: () => {},
        clearUser: () => {},
        setLoading: () => {},
        setError: () => {},
        _reset: () => {},
      })
    );

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRouteGuard>
                <div>Private Content</div>
              </PrivateRouteGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Private Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        setUser: () => {},
        clearUser: () => {},
        setLoading: () => {},
        setError: () => {},
        _reset: () => {},
      })
    );

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRouteGuard>
                <div>Private Content</div>
              </PrivateRouteGuard>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Private Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
