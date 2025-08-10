import { Doctor } from '../doctors/doctor.entity';
export declare enum AppointmentStatus {
    BOOKED = "booked",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum AppointmentType {
    WALK_IN = "walk_in",
    SCHEDULED = "scheduled"
}
export declare class Appointment {
    id: number;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    notes: string;
    status: AppointmentStatus;
    type: AppointmentType;
    appointmentDate: Date;
    appointmentTime: string;
    duration: number;
    doctor: Doctor;
    doctorId: number;
    createdAt: Date;
    updatedAt: Date;
}
