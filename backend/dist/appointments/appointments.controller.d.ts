import { AppointmentsService, CreateAppointmentDto, UpdateAppointmentDto } from './appointments.service';
import { AppointmentStatus } from './appointment.entity';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<import("./appointment.entity").Appointment>;
    findAll(): Promise<import("./appointment.entity").Appointment[]>;
    findByDoctor(doctorId: string): Promise<import("./appointment.entity").Appointment[]>;
    findByDate(date: string): Promise<import("./appointment.entity").Appointment[]>;
    findByStatus(status: AppointmentStatus): Promise<import("./appointment.entity").Appointment[]>;
    checkAvailability(doctorId: string, date: string, time: string, duration: string): Promise<{
        isAvailable: boolean;
    }>;
    findOne(id: string): Promise<import("./appointment.entity").Appointment>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<import("./appointment.entity").Appointment>;
    updateStatus(id: string, status: AppointmentStatus): Promise<import("./appointment.entity").Appointment>;
    remove(id: string): Promise<void>;
}
