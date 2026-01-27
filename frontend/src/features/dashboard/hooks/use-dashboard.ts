import useSWR from 'swr';

import type { DashboardStats, StaffLoad } from '../services/dashboard.service';
import { dashboardService } from '../services/dashboard.service';

/**
 * Hook for fetching dashboard stats
 */
export function useDashboardStats(): {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: unknown;
} {
  const { data, error, isLoading } = useSWR<DashboardStats>(
    '/dashboard/stats',
    dashboardService.getStats,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    stats: data || null,
    isLoading,
    error,
  };
}

/**
 * Hook for fetching staff load
 */
export function useStaffLoad(): {
  staffLoad: StaffLoad[];
  isLoading: boolean;
  error: unknown;
} {
  const { data, error, isLoading } = useSWR<StaffLoad[]>(
    '/dashboard/staff-load',
    dashboardService.getStaffLoad,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    staffLoad: data || [],
    isLoading,
    error,
  };
}
