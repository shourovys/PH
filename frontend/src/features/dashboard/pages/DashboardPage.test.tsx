import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import DashboardPage from './DashboardPage';

// Mock the hooks
vi.mock('../hooks/use-dashboard', () => ({
  useDashboardStats: () => ({
    stats: {
      totalAppointments: 10,
      completed: 5,
      pending: 3,
      waitingQueueCount: 2,
    },
    isLoading: false,
    error: null,
  }),
  useStaffLoad: () => ({
    staffLoad: [
      {
        staffId: '1',
        name: 'John Doe',
        current: 3,
        max: 5,
        status: 'Available',
      },
    ],
    isLoading: false,
    error: null,
  }),
  useActivityLogs: () => ({
    activityLogs: [
      {
        id: '1',
        action: 'QueueToStaff',
        description: 'Appointment assigned',
        appointmentId: 'appt1',
        staffId: 'staff1',
        timestamp: '2024-01-01T10:00:00Z',
        userId: 'user1',
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

describe('DashboardPage', () => {
  it('renders dashboard with stats', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Total Appointments Today')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Waiting Queue')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders staff load section', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Staff Load')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('3 / 5')).toBeInTheDocument();
  });

  it('renders activity logs section', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM — Appointment assigned')).toBeInTheDocument();
  });
});
