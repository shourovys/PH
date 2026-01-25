import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserRole } from '../users/user.schema.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private usersService: UsersService) {}

  async onModuleInit(): Promise<void> {
    await this.seedDemoUser();
  }

  private async seedDemoUser(): Promise<void> {
    const demoEmail = 'demo@example.com';
    const demoPassword = 'demo123';
    const demoName = 'Demo User';

    const existingUser = await this.usersService.findByEmail(demoEmail);
    if (!existingUser) {
      this.logger.log(`Seeding demo user: ${demoEmail}`);
      const newUser = await this.usersService.createUser(demoEmail, demoPassword, demoName);
      newUser.role = UserRole.ADMIN;
      await newUser.save();
    } else {
      this.logger.log('Demo user already exists');
    }
  }
}
