import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infra/services/database/prisma/prisma.module';
import { WebModule } from './infra/web/web.module';

@Module({
  imports: [PrismaModule, WebModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
