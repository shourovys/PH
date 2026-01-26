import useSWR from 'swr';

import { authSelectors, useAuthStore } from '@/features/auth';

import type { Appointment } from '../appointments.types';
import { appointmentsService } from '../services/appointments.service';

/**
 * Hook for fetching appointments data
 */
export function useAppointments(filters?: { date?: string; staffId?: string; status?: string }): {
  appointments: Appointment[];
  isLoading: boolean;
  error: unknown;
  mutate: (
    data?: Appointment[] | Promise<Appointment[]> | undefined,
    shouldRevalidate?: boolean | undefined
  ) => Promise<Appointment[] | undefined>;
} {
  const user = useAuthStore(authSelectors.user);
  const key = filters
    ? ['/appointments', { ...filters, userId: user?.id }]
    : ['/appointments', { userId: user?.id }];

  const { data, error, isLoading, mutate } = useSWR<Appointment[]>(
    key,
    () => appointmentsService.getAppointments({ ...filters, userId: user?.id }),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    appointments: data || [],
    isLoading,
    error,
    mutate,
  };
}
