import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useStaff } from '../hooks/use-staff';

function StaffListPage(): React.ReactElement {
  const { staff, isLoading } = useStaff();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <Button>Add Staff</Button>
      </div>

      {staff.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No staff members found.</p>
          <p className="text-sm text-muted-foreground">
            Add your first staff member to get started.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Daily Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.serviceType}</TableCell>
                <TableCell>{member.dailyCapacity}</TableCell>
                <TableCell>{member.availabilityStatus}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default StaffListPage;
