import useSWR from 'swr';

import type { ServiceDefinition } from '../services-definition.types';
import { servicesDefinitionService } from '../services/services-definition.service';

/**
 * Hook for fetching services definition data
 */
export function useServicesDefinition(): {
  services: ServiceDefinition[];
  isLoading: boolean;
  error: unknown;
  mutate: (
    data?: ServiceDefinition[] | Promise<ServiceDefinition[]> | undefined,
    shouldRevalidate?: boolean | undefined
  ) => Promise<ServiceDefinition[] | undefined>;
} {
  const { data, error, isLoading, mutate } = useSWR<ServiceDefinition[]>(
    '/services-definition',
    servicesDefinitionService.getServices,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    services: data || [],
    isLoading,
    error,
    mutate,
  };
}
