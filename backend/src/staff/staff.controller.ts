import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { CreateStaffDto } from './dto/create-staff.dto.js';
import type { UpdateStaffDto } from './dto/update-staff.dto.js';
import { Staff } from './staff.schema.js';
import { StaffService } from './staff.service.js';

@Controller('staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async create(@Body() createStaffDto: CreateStaffDto): Promise<Staff> {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  async findAll(): Promise<Staff[]> {
    return this.staffService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Staff | null> {
    return this.staffService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ): Promise<Staff | null> {
    return this.staffService.update(id, updateStaffDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Staff | null> {
    return this.staffService.remove(id);
  }
}
