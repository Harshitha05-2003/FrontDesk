import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus, AppointmentType } from './appointment.entity';
export declare class CreateAppointmentDto {
    patientName: string;
    patientPhone?: string;
    patientEmail?: string;
    notes?: string;
    appointmentDate: string;
    appointmentTime: string;
    duration?: number;
    doctorId: number;
    type?: AppointmentType;
}
export declare class UpdateAppointmentDto {
    patientName?: string;
    patientPhone?: string;
    patientEmail?: string;
    notes?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    duration?: number;
    status?: AppointmentStatus;
    doctorId?: number;
}
export declare class AppointmentsService {
    private appointmentsRepository;
    constructor(appointmentsRepository: Repository<Appointment>);
    create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment>;
    findAll(): Promise<Appointment[]>;
    findOne(id: number): Promise<Appointment | null>;
    findByDoctor(doctorId: number): Promise<Appointment[]>;
    findByDate(date: string): Promise<Appointment[]>;
    findByStatus(status: AppointmentStatus): Promise<Appointment[]>;
    checkAvailability(doctorId: number, date: string, time: string, duration?: number): Promise<boolean>;
    update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment | null>;
    updateStatus(id: number, status: AppointmentStatus): Promise<Appointment | null>;
    remove(id: number): Promise<void>;
}
