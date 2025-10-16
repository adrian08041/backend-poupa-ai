import { Provider } from '@nestjs/common';
import { PrismaService } from 'src/infra/services/database/prisma/prisma.service';
import { TransactionPrismaRepository } from './transaction.repository';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository.interface';

export const TransactionPrismaRepositoryProvider: Provider = {
  provide: TransactionRepository,
  useFactory: (prisma: PrismaService) => {
    return new TransactionPrismaRepository(prisma);
  },
  inject: [PrismaService],
};
