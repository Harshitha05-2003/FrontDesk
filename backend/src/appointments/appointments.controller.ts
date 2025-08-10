import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppointmentsService, CreateAppointmentDto, UpdateAppointmentDto } from './appointments.service';
import { AppointmentStatus } from './appointment.entity';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('doctor/:doctorId')
  findByDoctor(@Param('doctorId') doctorId: string) {
    return this.appointmentsService.findByDoctor(+doctorId);
  }

  @Get('date/:date')
  findByDate(@Param('date') date: string) {
    return this.appointmentsService.findByDate(date);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: AppointmentStatus) {
    return this.appointmentsService.findByStatus(status);
  }

  @Get('availability')
  async checkAvailability(
    @Query('doctorId') doctorId: string,
    @Query('date') date: string,
    @Query('time') time: string,
    @Query('duration') duration: string,
  ) {
    const isAvailable = await this.appointmentsService.checkAvailability(
      +doctorId,
      date,
      time,
      duration ? +duration : 30,
    );
    return { isAvailable };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: AppointmentStatus) {
    return this.appointmentsService.updateStatus(+id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
