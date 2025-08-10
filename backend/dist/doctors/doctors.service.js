"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsService = exports.CreateDoctorDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const doctor_entity_1 = require("./doctor.entity");
const class_validator_1 = require("class-validator");
class CreateDoctorDto {
}
exports.CreateDoctorDto = CreateDoctorDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(doctor_entity_1.DoctorSpecialization),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "specialization", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(doctor_entity_1.DoctorGender),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDoctorDto.prototype, "isAvailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDoctorDto.prototype, "availability", void 0);
let DoctorsService = class DoctorsService {
    constructor(doctorsRepository) {
        this.doctorsRepository = doctorsRepository;
    }
    async create(createDoctorDto) {
        const doctor = this.doctorsRepository.create(createDoctorDto);
        return this.doctorsRepository.save(doctor);
    }
    async findAll() {
        return this.doctorsRepository.find();
    }
    async findOne(id) {
        return this.doctorsRepository.findOne({ where: { id } });
    }
    async findBySpecialization(specialization) {
        return this.doctorsRepository.find({ where: { specialization } });
    }
    async findByLocation(location) {
        return this.doctorsRepository.find({ where: { location } });
    }
    async findAvailable() {
        return this.doctorsRepository.find({ where: { isAvailable: true } });
    }
    async search(query) {
        return this.doctorsRepository
            .createQueryBuilder('doctor')
            .where('doctor.firstName LIKE :query OR doctor.lastName LIKE :query OR doctor.specialization LIKE :query OR doctor.location LIKE :query', {
            query: `%${query}%`,
        })
            .getMany();
    }
    async update(id, updateDoctorDto) {
        await this.doctorsRepository.update(id, updateDoctorDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.doctorsRepository.delete(id);
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(doctor_entity_1.Doctor)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map