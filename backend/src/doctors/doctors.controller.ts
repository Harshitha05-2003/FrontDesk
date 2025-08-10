import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DoctorsService, CreateDoctorDto } from './doctors.service';
import { DoctorSpecialization } from './doctor.entity';

@Controller('doctors')
@UseGuards(JwtAuthGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.doctorsService.findAvailable();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.doctorsService.search(query);
  }

  @Get('specialization/:specialization')
  findBySpecialization(@Param('specialization') specialization: DoctorSpecialization) {
    return this.doctorsService.findBySpecialization(specialization);
  }

  @Get('location/:location')
  findByLocation(@Param('location') location: string) {
    return this.doctorsService.findByLocation(location);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: Partial<CreateDoctorDto>) {
    return this.doctorsService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(+id);
  }
}
