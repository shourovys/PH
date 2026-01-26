import { useEffect, useState, type ReactElement } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useServicesDefinition } from '../../services-definition/hooks/use-services-definition';
import { useStaff } from '../../staff/hooks/use-staff';
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '../appointments.types';
import { appointmentsService } from '../services/appointments.service';

const appointmentSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  serviceId: z.string().min(1, 'Service is required'),
  staffId: z.string().optional(),
  appointmentDate: z.string().min(1, 'Date is required'),
  appointmentTime: z.string().min(1, 'Time is required'),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment;
  onSuccess: () => void;
}

export function AppointmentFormDialog({
  open,
  onOpenChange,
  appointment,
  onSuccess,
}: AppointmentFormDialogProps): ReactElement {
  const isEdit = !!appointment;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    customerName: '',
    serviceId: '',
    staffId: '',
    appointmentDate: '',
    appointmentTime: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { services } = useServicesDefinition();
  const { staff } = useStaff();

  useEffect(() => {
    if (appointment) {
      setFormData({
        customerName: appointment.customerName,
        serviceId: appointment.serviceId,
        staffId: appointment.staffId || '',
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
      });
    } else {
      setFormData({
        customerName: '',
        serviceId: '',
        staffId: '',
        appointmentDate: '',
        appointmentTime: '',
      });
    }
    setErrors({});
  }, [appointment, open]);

  const selectedService = services.find((s) => s._id === formData.serviceId);
  const availableStaff = staff.filter(
    (s) => !selectedService || s.serviceType === selectedService.requiredStaffType
  );

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const result = appointmentSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      if (isEdit && appointment) {
        await appointmentsService.updateAppointment(
          appointment.id,
          formData as UpdateAppointmentRequest
        );
        toast.success('Appointment updated successfully');
      } else {
        await appointmentsService.createAppointment(formData as CreateAppointmentRequest);
        toast.success('Appointment created successfully');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response &&
        error.response.status === 409
      ) {
        toast.error('Time conflict detected. Please choose a different time or staff.');
      } else {
        toast.error(isEdit ? 'Failed to update appointment' : 'Failed to create appointment');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof AppointmentFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Appointment' : 'Book Appointment'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the appointment details.' : 'Schedule a new appointment.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerName">Customer Name</Label>
              <div className="col-span-3">
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  placeholder="Customer name"
                  disabled={isLoading}
                />
                {errors.customerName && (
                  <p className="text-sm text-destructive mt-1">{errors.customerName}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceId">Service</Label>
              <div className="col-span-3">
                <Select
                  value={formData.serviceId}
                  onValueChange={(value) => handleChange('serviceId', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service._id} value={service._id}>
                        {service.name} ({service.duration} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.serviceId && (
                  <p className="text-sm text-destructive mt-1">{errors.serviceId}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="staffId">Staff</Label>
              <div className="col-span-3">
                <Select
                  value={formData.staffId}
                  onValueChange={(value) => handleChange('staffId', value)}
                  disabled={isLoading || !formData.serviceId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStaff.map((staffMember) => (
                      <SelectItem key={staffMember._id} value={staffMember._id}>
                        {staffMember.name} ({staffMember.serviceType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointmentDate">Date</Label>
              <div className="col-span-3">
                <Input
                  id="appointmentDate"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => handleChange('appointmentDate', e.target.value)}
                  disabled={isLoading}
                />
                {errors.appointmentDate && (
                  <p className="text-sm text-destructive mt-1">{errors.appointmentDate}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointmentTime">Time</Label>
              <div className="col-span-3">
                <Input
                  id="appointmentTime"
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => handleChange('appointmentTime', e.target.value)}
                  disabled={isLoading}
                />
                {errors.appointmentTime && (
                  <p className="text-sm text-destructive mt-1">{errors.appointmentTime}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEdit
                  ? 'Updating...'
                  : 'Booking...'
                : isEdit
                  ? 'Update'
                  : 'Book Appointment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
