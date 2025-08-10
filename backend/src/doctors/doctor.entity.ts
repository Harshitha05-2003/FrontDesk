import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Appointment } from '../appointments/appointment.entity';

export enum DoctorSpecialization {
  GENERAL = 'general',
  CARDIOLOGY = 'cardiology',
  DERMATOLOGY = 'dermatology',
  ORTHOPEDICS = 'orthopedics',
  PEDIATRICS = 'pediatrics',
  NEUROLOGY = 'neurology',
  PSYCHIATRY = 'psychiatry',
  SURGERY = 'surgery',
}

export enum DoctorGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: DoctorSpecialization,
  })
  specialization: DoctorSpecialization;

  @Column({
    type: 'enum',
    enum: DoctorGender,
  })
  gender: DoctorGender;

  @Column()
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'json', nullable: true })
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
