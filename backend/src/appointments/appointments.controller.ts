/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Appointment, AppointmentStatus } from './appointment.schema.js';
import { AppointmentsService } from './appointments.service.js';
import type { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import type { UpdateAppointmentDto } from './dto/update-appointment.dto.js';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Query('userId') userId: string,
  ): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentDto, userId);
  }

  @Get()
  findAll(
    @Query('userId') userId: string,
    @Query() filters: { date?: string; staffId?: string; status?: string },
  ) {
    return this.appointmentsService.findAll(userId, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.appointmentsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Query('userId') userId: string,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.appointmentsService.remove(id, userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
    @Query('userId') userId: string,
  ) {
    return this.appointmentsService.updateStatus(id, status, userId);
  }

  @Get('queue')
  getQueue(@Query('userId') userId: string) {
    return this.appointmentsService.getQueue(userId);
  }

  @Post('queue/assign/:staffId')
  assignFromQueue(@Param('staffId') staffId: string, @Query('userId') userId: string) {
    return this.appointmentsService.assignFromQueue(staffId, userId);
  }
}
