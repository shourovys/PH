import React from 'react';
import { Link } from 'react-router-dom';

import { AUTH_LINKS } from '@/features/auth';
import { DEMO_LINKS } from '@/features/demo';

export function DashboardPage(): React.ReactElement {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight">Welcome to React Starter</h1>
      <p className="mt-4 text-muted-foreground">
        This is a production-grade React + Vite + TypeScript frontend foundation.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          to={AUTH_LINKS.LOGIN}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Go to Login
        </Link>
        <Link
          to={DEMO_LINKS.ERROR_DEMO}
          className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow hover:bg-secondary/80"
        >
          Error Handling Demo
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;
