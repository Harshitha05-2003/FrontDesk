import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { Appointment, AppointmentStatus, AppointmentType } from './appointment.entity';

export class CreateAppointmentDto {
  @IsString()
  patientName: string;

  @IsOptional()
  @IsString()
  patientPhone?: string;

  @IsOptional()
  @IsString()
  patientEmail?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  appointmentDate: string;

  @IsString()
  appointmentTime: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsNumber()
  doctorId: number;

  @IsOptional()
  @IsEnum(AppointmentType)
  type?: AppointmentType;
}

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  patientName?: string;

  @IsOptional()
  @IsString()
  patientPhone?: string;

  @IsOptional()
  @IsString()
  patientEmail?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  appointmentDate?: string;

  @IsOptional()
  @IsString()
  appointmentTime?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsNumber()
  doctorId?: number;
}

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
    });
    return this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      relations: ['doctor'],
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Appointment | null> {
    return this.appointmentsRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });
  }

  async findByDoctor(doctorId: number): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { doctorId },
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
  }

  async findByDate(date: string): Promise<Appointment[]> {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    return this.appointmentsRepository.find({
      where: {
        appointmentDate: Between(startDate, endDate),
      },
      relations: ['doctor'],
      order: { appointmentTime: 'ASC' },
    });
  }

  async findByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { status },
      relations: ['doctor'],
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
  }

  async checkAvailability(doctorId: number, date: string, time: string, duration: number = 30): Promise<boolean> {
    const appointmentDate = new Date(date);
    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const conflictingAppointments = await this.appointmentsRepository.find({
      where: {
        doctorId,
        appointmentDate,
        status: AppointmentStatus.BOOKED,
      },
    });

    for (const appointment of conflictingAppointments) {
      const appointmentStart = new Date(`${date}T${appointment.appointmentTime}`);
      const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration * 60000);

      if (
        (startTime < appointmentEnd && endTime > appointmentStart) ||
        (appointmentStart < endTime && appointmentEnd > startTime)
      ) {
        return false;
      }
    }

    return true;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment | null> {
    const updateData: any = { ...updateAppointmentDto };
    if (updateAppointmentDto.appointmentDate) {
      updateData.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
    }
    await this.appointmentsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async updateStatus(id: number, status: AppointmentStatus): Promise<Appointment | null> {
    await this.appointmentsRepository.update(id, { status });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.appointmentsRepository.delete(id);
  }
}
