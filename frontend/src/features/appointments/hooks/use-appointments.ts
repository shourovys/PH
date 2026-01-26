import useSWR from 'swr';

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
  const key = filters ? ['/appointments', filters] : '/appointments';

  const { data, error, isLoading, mutate } = useSWR<Appointment[]>(
    key,
    () => appointmentsService.getAppointments(filters),
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
