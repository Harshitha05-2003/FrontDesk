import { Repository } from 'typeorm';
import { Doctor, DoctorSpecialization, DoctorGender } from './doctor.entity';
export declare class CreateDoctorDto {
    firstName: string;
    lastName: string;
    specialization: DoctorSpecialization;
    gender: DoctorGender;
    location: string;
    description?: string;
    isAvailable?: boolean;
    availability?: any;
}
export declare class DoctorsService {
    private doctorsRepository;
    constructor(doctorsRepository: Repository<Doctor>);
    create(createDoctorDto: CreateDoctorDto): Promise<Doctor>;
    findAll(): Promise<Doctor[]>;
    findOne(id: number): Promise<Doctor | null>;
    findBySpecialization(specialization: DoctorSpecialization): Promise<Doctor[]>;
    findByLocation(location: string): Promise<Doctor[]>;
    findAvailable(): Promise<Doctor[]>;
    search(query: string): Promise<Doctor[]>;
    update(id: number, updateDoctorDto: Partial<CreateDoctorDto>): Promise<Doctor | null>;
    remove(id: number): Promise<void>;
}
