import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { Appointment } from '../appointments.types';
import { AppointmentFormDialog } from '../components/AppointmentFormDialog';
import { useAppointments } from '../hooks/use-appointments';

function AppointmentsListPage(): React.ReactElement {
  const [dateFilter, setDateFilter] = useState('');
  const [staffFilter, setStaffFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>();

  const { appointments, isLoading, mutate } = useAppointments({
    date: dateFilter || undefined,
    staffId: staffFilter === 'all' ? undefined : staffFilter || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter || undefined,
  });

  const handleNewAppointment = (): void => {
    setEditingAppointment(undefined);
    setDialogOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment): void => {
    setEditingAppointment(appointment);
    setDialogOpen(true);
  };

  const handleDialogSuccess = (): void => {
    mutate();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Appointments Management</h1>
        <Button onClick={handleNewAppointment}>New Appointment</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="space-y-2">
          <Label htmlFor="date-filter">Date</Label>
          <Input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="staff-filter">Staff</Label>
          <Select value={staffFilter} onValueChange={setStaffFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All staff</SelectItem>
              {/* TODO: Load staff options */}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="No-Show">No-Show</SelectItem>
              <SelectItem value="Waiting">Waiting</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No appointments found.</p>
          <p className="text-sm text-muted-foreground">
            Create your first appointment to get started.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.customerName}</TableCell>
                <TableCell>{/* TODO: Service name */}</TableCell>
                <TableCell>{/* TODO: Staff name */}</TableCell>
                <TableCell>{appointment.appointmentDate}</TableCell>
                <TableCell>{appointment.appointmentTime}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === 'Scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : appointment.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : appointment.status === 'No-Show'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleEditAppointment(appointment)}
                  >
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="mr-2">
                    Cancel
                  </Button>
                  <Button variant="outline" size="sm" className="mr-2">
                    Complete
                  </Button>
                  <Button variant="outline" size="sm">
                    No-Show
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AppointmentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        appointment={editingAppointment}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}

export default AppointmentsListPage;
