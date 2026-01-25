import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { swrConfig } from '@/lib/swr-config';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): React.ReactElement {
  return (
    <ErrorBoundary>
      <SWRConfig value={swrConfig}>
        <BrowserRouter>{children}</BrowserRouter>
      </SWRConfig>
    </ErrorBoundary>
  );
}
