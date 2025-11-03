import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/repositories/database.module';
import { TransactionUsecaseModule } from '../transaction/usecase.module';
import { CreateRecurringTransactionUsecase } from './create/create-recurring-transaction.usecase';
import { ListRecurringTransactionsUsecase } from './list/list-recurring-transactions.usecase';
import { ToggleRecurringTransactionUsecase } from './toggle/toggle-recurring-transaction.usecase';
import { DeleteRecurringTransactionUsecase } from './delete/delete-recurring-transaction.usecase';
import { ProcessRecurringTransactionsUseCase } from './process/process-recurring-transactions.usecase';
import { RecurringTransactionProcessorService } from './process/recurring-transaction-processor.service';
import { PrismaRecurringTransactionRepository } from 'src/infra/repositories/prisma/recurring-transaction/prisma-recurring-transaction.repository';
import { PrismaModule } from 'src/infra/services/database/prisma/prisma.module';
import { TransactionGateway } from 'src/domain/repositories/transaction.gateway';
import { RecurringTransactionRepository } from 'src/domain/repositories/recurring-transaction.repository.interface';

@Module({
  imports: [DatabaseModule, PrismaModule, forwardRef(() => TransactionUsecaseModule)],
  providers: [
    PrismaRecurringTransactionRepository,
    {
      provide: 'RecurringTransactionRepository',
      useExisting: PrismaRecurringTransactionRepository,
    },
    CreateRecurringTransactionUsecase,
    ListRecurringTransactionsUsecase,
    ToggleRecurringTransactionUsecase,
    {
      provide: DeleteRecurringTransactionUsecase,
      useFactory: (
        recurringTransactionRepository: RecurringTransactionRepository,
        transactionGateway: TransactionGateway,
      ) => {
        return new DeleteRecurringTransactionUsecase(
          recurringTransactionRepository,
          transactionGateway,
        );
      },
      inject: ['RecurringTransactionRepository', TransactionGateway],
    },
    ProcessRecurringTransactionsUseCase,
    RecurringTransactionProcessorService,
  ],
  exports: [
    CreateRecurringTransactionUsecase,
    ListRecurringTransactionsUsecase,
    ToggleRecurringTransactionUsecase,
    DeleteRecurringTransactionUsecase,
    ProcessRecurringTransactionsUseCase,
    RecurringTransactionProcessorService,
  ],
})
export class RecurringTransactionUsecaseModule {}
