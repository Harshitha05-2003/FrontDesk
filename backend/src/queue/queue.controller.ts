import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueueService, CreateQueueDto, UpdateQueueDto } from './queue.service';
import { QueueStatus } from './queue.entity';

@Controller('queue')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  create(@Body() createQueueDto: CreateQueueDto) {
    return this.queueService.create(createQueueDto);
  }

  @Get()
  findAll() {
    return this.queueService.findAll();
  }

  @Get('active')
  findActive() {
    return this.queueService.findActive();
  }

  @Get('next')
  getNextInQueue() {
    return this.queueService.getNextInQueue();
  }

  @Get('stats')
  getQueueStats() {
    return this.queueService.getQueueStats();
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: QueueStatus) {
    return this.queueService.findByStatus(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queueService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQueueDto: UpdateQueueDto) {
    return this.queueService.update(+id, updateQueueDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: QueueStatus) {
    return this.queueService.updateStatus(+id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queueService.remove(+id);
  }
}
