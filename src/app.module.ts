import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infra/services/database/prisma/prisma.module';
import { WebModule } from './infra/web/web.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, WebModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
