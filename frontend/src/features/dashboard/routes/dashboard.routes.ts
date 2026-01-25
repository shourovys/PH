import React from 'react';

import MainLayout from '@/components/layouts/MainLayout';
import type { RouteConfig } from '@/types/route.types';

// Define dashboard route link constants
export const DASHBOARD_LINKS = {
  DASHBOARD: '/',
  PROFILE: '/profile',
};

export const DASHBOARD_ROUTES: RouteConfig[] = [
  {
    element: MainLayout,
    isLayout: true,
    path: DASHBOARD_LINKS.DASHBOARD,
    auth: 'authenticated',
    children: [
      {
        index: true,
        element: React.lazy(() => import('../pages/DashboardPage')),
        name: 'Dashboard',
        auth: 'authenticated',
      },
      {
        path: DASHBOARD_LINKS.PROFILE,
        element: React.lazy(() => import('../pages/ProfilePage')),
        name: 'Profile',
        auth: 'authenticated',
      },
    ],
  },
];
