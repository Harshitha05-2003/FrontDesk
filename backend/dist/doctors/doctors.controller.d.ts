import { DoctorsService, CreateDoctorDto } from './doctors.service';
import { DoctorSpecialization } from './doctor.entity';
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
    create(createDoctorDto: CreateDoctorDto): Promise<import("./doctor.entity").Doctor>;
    findAll(): Promise<import("./doctor.entity").Doctor[]>;
    findAvailable(): Promise<import("./doctor.entity").Doctor[]>;
    search(query: string): Promise<import("./doctor.entity").Doctor[]>;
    findBySpecialization(specialization: DoctorSpecialization): Promise<import("./doctor.entity").Doctor[]>;
    findByLocation(location: string): Promise<import("./doctor.entity").Doctor[]>;
    findOne(id: string): Promise<import("./doctor.entity").Doctor>;
    update(id: string, updateDoctorDto: Partial<CreateDoctorDto>): Promise<import("./doctor.entity").Doctor>;
    remove(id: string): Promise<void>;
}
