import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor, DoctorSpecialization, DoctorGender } from './doctor.entity';

import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(DoctorSpecialization)
  specialization: DoctorSpecialization;

  @IsEnum(DoctorGender)
  gender: DoctorGender;

  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  availability?: any;
}

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorsRepository.create(createDoctorDto);
    return this.doctorsRepository.save(doctor);
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorsRepository.find();
  }

  async findOne(id: number): Promise<Doctor | null> {
    return this.doctorsRepository.findOne({ where: { id } });
  }

  async findBySpecialization(specialization: DoctorSpecialization): Promise<Doctor[]> {
    return this.doctorsRepository.find({ where: { specialization } });
  }

  async findByLocation(location: string): Promise<Doctor[]> {
    return this.doctorsRepository.find({ where: { location } });
  }

  async findAvailable(): Promise<Doctor[]> {
    return this.doctorsRepository.find({ where: { isAvailable: true } });
  }

  async search(query: string): Promise<Doctor[]> {
    return this.doctorsRepository
      .createQueryBuilder('doctor')
      .where('doctor.firstName LIKE :query OR doctor.lastName LIKE :query OR doctor.specialization LIKE :query OR doctor.location LIKE :query', {
        query: `%${query}%`,
      })
      .getMany();
  }

  async update(id: number, updateDoctorDto: Partial<CreateDoctorDto>): Promise<Doctor | null> {
    await this.doctorsRepository.update(id, updateDoctorDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.doctorsRepository.delete(id);
  }
}
