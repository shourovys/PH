import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ActivityLog } from './activity-log.schema.js';
import { ActivityLogService } from './activity-log.service.js';

@Controller('activity-logs')
@UseGuards(JwtAuthGuard)
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  async getRecentLogs(): Promise<ActivityLog[]> {
    // TODO: Get userId from request
    const userId = 'dummy'; // Replace with actual user extraction
    return this.activityLogService.getRecentLogs(userId);
  }
}
