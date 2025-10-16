import { Module } from '@nestjs/common';
import { UserPrismaRepositoryProvider } from './prisma/user/model/user.prisma.repository.provider';
import { PrismaService } from '../services/database/prisma/prisma.service';

import { TransactionPrismaRepositoryProvider } from './prisma/transaction/transaction.prisma.repository.provider';

@Module({
  providers: [
    PrismaService,
    UserPrismaRepositoryProvider,
    TransactionPrismaRepositoryProvider,
  ],
  exports: [UserPrismaRepositoryProvider, TransactionPrismaRepositoryProvider],
})
export class DatabaseModule {}
