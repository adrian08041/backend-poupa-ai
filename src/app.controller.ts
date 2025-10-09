import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './infra/services/database/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('users')
  async getUsers() {
    return this.prisma.user.findMany();
  }

  @Get('health')
  async healthCheck() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'connected' };
  }
}
