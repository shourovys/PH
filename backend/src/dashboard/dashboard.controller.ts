import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UserDocument } from '../users/user.schema.js';
import { DashboardService, StaffLoad, TodayStats } from './dashboard.service.js';

interface AuthenticatedRequest extends ExpressRequest {
  user: UserDocument;
}

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Request() req: AuthenticatedRequest): Promise<{
    todayStats: TodayStats;
    staffLoad: StaffLoad[];
  }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const userId = req.user._id.toString();

    const [todayStats, staffLoad] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.dashboardService.getTodayStats(userId),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.dashboardService.getStaffLoad(userId),
    ]);

    return {
      todayStats,
      staffLoad,
    };
  }
}
