import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStaffDto } from './dto/create-staff.dto.js';
import { UpdateStaffDto } from './dto/update-staff.dto.js';
import { Staff, StaffDocument } from './staff.schema.js';

@Injectable()
export class StaffService {
  constructor(@InjectModel(Staff.name) private staffModel: Model<StaffDocument>) {}

  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    const createdStaff = new this.staffModel(createStaffDto);
    return createdStaff.save();
  }

  async findAll(): Promise<Staff[]> {
    return this.staffModel.find().exec();
  }

  async findOne(id: string): Promise<Staff> {
    const staff = await this.staffModel.findById(id).exec();
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }
    return staff;
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    const existingStaff = await this.staffModel
      .findByIdAndUpdate(id, updateStaffDto, { new: true })
      .exec();
    if (!existingStaff) {
      throw new NotFoundException('Staff member not found');
    }
    return existingStaff;
  }

  async remove(id: string): Promise<Staff> {
    const result = await this.staffModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Staff member not found');
    }
    return result;
  }
}
