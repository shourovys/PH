import { apiClient } from '@/services/api-client';

export interface DashboardStats {
  totalAppointments: number;
  completed: number;
  pending: number;
  waitingQueueCount: number;
}

export interface StaffLoad {
  staffId: string;
  name: string;
  current: number;
  max: number;
  status: 'Available' | 'On Leave';
}

/**
 * Dashboard service for API calls
 */
export const dashboardService = {
  /**
   * Get dashboard stats
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data.data;
  },

  /**
   * Get staff load
   */
  getStaffLoad: async (): Promise<StaffLoad[]> => {
    const response = await apiClient.get<StaffLoad[]>('/dashboard/staff-load');
    return response.data.data;
  },
};
