import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './infra/services/database/prisma/prisma.service';
import { IsPublic } from './infra/web/auth/decorators/is-public.decorator';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @IsPublic()
  @Get('users')
  async getUsers() {
    return this.prisma.user.findMany();
  }

  @IsPublic()
  @Get('health')
  async healthCheck() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'connected' };
  }
}
