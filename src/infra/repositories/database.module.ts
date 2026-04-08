import { Module } from '@nestjs/common';
import { UserPrismaRepositoryProvider } from './prisma/user/model/user.prisma.repository.provider';
import { PrismaService } from '../services/database/prisma/prisma.service';

import { TransactionPrismaRepositoryProvider } from './prisma/transaction/transaction.prisma.repository.provider';
import { MetadataPrismaRepositoryProvider } from './metadata-prisma.provider';
import { RefreshTokenRepository } from './prisma/refresh-token/refresh-token.repository';

@Module({
  providers: [
    PrismaService,
    UserPrismaRepositoryProvider,
    TransactionPrismaRepositoryProvider,
    MetadataPrismaRepositoryProvider,
    RefreshTokenRepository,
  ],
  exports: [
    UserPrismaRepositoryProvider,
    TransactionPrismaRepositoryProvider,
    MetadataPrismaRepositoryProvider,
    RefreshTokenRepository,
  ],
})
export class DatabaseModule {}
