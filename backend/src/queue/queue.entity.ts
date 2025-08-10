import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum QueueStatus {
  WAITING = 'waiting',
  WITH_DOCTOR = 'with_doctor',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum QueuePriority {
  NORMAL = 'normal',
  URGENT = 'urgent',
  VIP = 'vip',
}

@Entity('queue')
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  queueNumber: number;

  @Column()
  patientName: string;

  @Column({ nullable: true })
  patientPhone: string;

  @Column({ nullable: true })
  patientEmail: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.WAITING,
  })
  status: QueueStatus;

  @Column({
    type: 'enum',
    enum: QueuePriority,
    default: QueuePriority.NORMAL,
  })
  priority: QueuePriority;

  @Column({ type: 'datetime' })
  checkInTime: Date;

  @Column({ type: 'datetime', nullable: true })
  calledTime: Date;

  @Column({ type: 'datetime', nullable: true })
  completedTime: Date;

  @Column({ type: 'int', nullable: true })
  estimatedWaitTime: number; // in minutes

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
