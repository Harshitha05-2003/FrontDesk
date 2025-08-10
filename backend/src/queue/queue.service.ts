import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Queue, QueueStatus, QueuePriority } from './queue.entity';

export class CreateQueueDto {
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
  reason?: string;

  @IsOptional()
  @IsEnum(QueuePriority)
  priority?: QueuePriority;
}

export class UpdateQueueDto {
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
  reason?: string;

  @IsOptional()
  @IsEnum(QueueStatus)
  status?: QueueStatus;

  @IsOptional()
  @IsEnum(QueuePriority)
  priority?: QueuePriority;

  @IsOptional()
  estimatedWaitTime?: number;

  @IsOptional()
  calledTime?: Date;

  @IsOptional()
  completedTime?: Date;
}

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
  ) {}

  async create(createQueueDto: CreateQueueDto): Promise<Queue> {
    const lastQueue = await this.queueRepository.findOne({
      where: {},
      order: { queueNumber: 'DESC' },
    });

    const queueNumber = lastQueue ? lastQueue.queueNumber + 1 : 1;

    const queue = this.queueRepository.create({
      ...createQueueDto,
      queueNumber,
      checkInTime: new Date(),
    });

    return this.queueRepository.save(queue);
  }

  async findAll(): Promise<Queue[]> {
    return this.queueRepository.find({
      order: {
        priority: 'ASC',
        checkInTime: 'ASC',
      },
    });
  }

  async findActive(): Promise<Queue[]> {
    return this.queueRepository.find({
      where: [
        { status: QueueStatus.WAITING },
        { status: QueueStatus.WITH_DOCTOR },
      ],
      order: {
        priority: 'ASC',
        checkInTime: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Queue | null> {
    return this.queueRepository.findOne({ where: { id } });
  }

  async findByStatus(status: QueueStatus): Promise<Queue[]> {
    return this.queueRepository.find({
      where: { status },
      order: {
        priority: 'ASC',
        checkInTime: 'ASC',
      },
    });
  }

  async findByPriority(priority: QueuePriority): Promise<Queue[]> {
    return this.queueRepository.find({
      where: { priority },
      order: { checkInTime: 'ASC' },
    });
  }

  async getNextInQueue(): Promise<Queue | null> {
    return this.queueRepository.findOne({
      where: { status: QueueStatus.WAITING },
      order: {
        priority: 'ASC',
        checkInTime: 'ASC',
      },
    });
  }

  async update(id: number, updateQueueDto: UpdateQueueDto): Promise<Queue | null> {
    if (updateQueueDto.status === QueueStatus.WITH_DOCTOR) {
      updateQueueDto.calledTime = new Date();
    } else if (updateQueueDto.status === QueueStatus.COMPLETED) {
      updateQueueDto.completedTime = new Date();
    }

    await this.queueRepository.update(id, updateQueueDto);
    return this.findOne(id);
  }

  async updateStatus(id: number, status: QueueStatus): Promise<Queue | null> {
    const updateData: any = { status };
    
    if (status === QueueStatus.WITH_DOCTOR) {
      updateData.calledTime = new Date();
    } else if (status === QueueStatus.COMPLETED) {
      updateData.completedTime = new Date();
    }

    await this.queueRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.queueRepository.delete(id);
  }

  async getQueueStats(): Promise<any> {
    const [waiting, withDoctor, completed, cancelled] = await Promise.all([
      this.queueRepository.count({ where: { status: QueueStatus.WAITING } }),
      this.queueRepository.count({ where: { status: QueueStatus.WITH_DOCTOR } }),
      this.queueRepository.count({ where: { status: QueueStatus.COMPLETED } }),
      this.queueRepository.count({ where: { status: QueueStatus.CANCELLED } }),
    ]);

    return {
      waiting,
      withDoctor,
      completed,
      cancelled,
      total: waiting + withDoctor + completed + cancelled,
    };
  }
}
