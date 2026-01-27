import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQueue } from '@/features/appointments/hooks/use-appointments';

export default function QueuePage() {
  const { queue, isLoading } = useQueue();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Waiting Queue</h1>
        <p className="text-muted-foreground">Manage appointments waiting for assignment</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queue ({queue.length} appointments)</CardTitle>
        </CardHeader>
        <CardContent>
          {queue.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No appointments in queue</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Requested Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((appointment, index) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </TableCell>
                    <TableCell>{appointment.customerName}</TableCell>
                    <TableCell>Unknown</TableCell>
                    <TableCell>
                      {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')} at{' '}
                      {appointment.appointmentTime}
                    </TableCell>
                    <TableCell>
                      <Button size="sm">Assign</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* <QueueAssignDialog
        appointment={selectedAppointment}
        staff={staff}
        services={services}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleAssignSuccess}
      /> */}
    </div>
  );
}
