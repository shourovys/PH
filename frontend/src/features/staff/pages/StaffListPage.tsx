import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { StaffFormDialog } from '../components/StaffFormDialog';
import { useStaff } from '../hooks/use-staff';
import type { Staff } from '../staff.types';

function StaffListPage(): React.ReactElement {
  const { staff, isLoading, mutate } = useStaff();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | undefined>();

  const handleAddStaff = (): void => {
    setEditingStaff(undefined);
    setDialogOpen(true);
  };

  const handleEditStaff = (staffMember: Staff): void => {
    setEditingStaff(staffMember);
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
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <Button onClick={handleAddStaff}>Add Staff</Button>
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
              <TableRow key={member._id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.serviceType}</TableCell>
                <TableCell>{member.dailyCapacity}</TableCell>
                <TableCell>{member.availabilityStatus}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleEditStaff(member)}
                  >
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

      <StaffFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        staff={editingStaff}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}

export default StaffListPage;
