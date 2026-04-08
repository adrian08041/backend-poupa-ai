import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './infra/services/database/prisma/prisma.service';
import { IsPublic } from './infra/web/auth/decorators/is-public.decorator';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @IsPublic()
  @Get('health')
  healthCheck() {
    return { status: 'ok' };
  }

  @IsPublic()
  @Get('health/ready')
  async readinessCheck() {
    const checks: Record<string, string> = {};

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = 'connected';
    } catch {
      checks.database = 'disconnected';
    }

    const allHealthy = Object.values(checks).every((v) => v !== 'disconnected');

    return {
      status: allHealthy ? 'ok' : 'degraded',
      checks,
    };
  }
}
