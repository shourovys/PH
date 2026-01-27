export interface Appointment {
  id: string;
  customerName: string;
  serviceId: string;
  staffId: string | null;
  appointmentDate: string; // ISO date string
  appointmentTime: string; // HH:MM format
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show' | 'Waiting';
  queuePosition: number | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  customerName: string;
  serviceId: string;
  staffId?: string | null;
  appointmentDate: string;
  appointmentTime: string;
}

export type UpdateAppointmentRequest = Partial<
  CreateAppointmentRequest & { status: Appointment['status'] }
>;

export interface AppointmentWithDetails extends Appointment {
  service?: {
    id: string;
    name: string;
    duration: number;
  };
  staff?: {
    id: string;
    name: string;
  };
}
