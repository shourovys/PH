import { AUTH_ROUTES } from '@/features/auth';
import { DASHBOARD_ROUTES } from '@/features/dashboard';
import { DEMO_ROUTES } from '@/features/demo';
import type { RouteConfig } from '@/types/route.types';

// Define all routes in a centralized configuration
export const routes: RouteConfig[] = [...AUTH_ROUTES, ...DEMO_ROUTES, ...DASHBOARD_ROUTES];

// Export route configurations for use in the application
export default routes;
