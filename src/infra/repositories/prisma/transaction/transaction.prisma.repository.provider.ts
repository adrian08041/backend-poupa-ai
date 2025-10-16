import { TransactionGateway } from 'src/domain/repositories/transaction.gateway';
import { TransactionPrismaRepository } from './transaction.prisma.repository';

export const TransactionPrismaRepositoryProvider = {
  provide: TransactionGateway,
  useClass: TransactionPrismaRepository,
};
