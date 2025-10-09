import { Module } from '@nestjs/common';
import { UserPrismaRepository } from './prisma/user/model/user.prisma.repository';

@Module({
  providers: [UserPrismaRepository],
  exports: [UserPrismaRepository],
})
export class DatabaseModule {}
