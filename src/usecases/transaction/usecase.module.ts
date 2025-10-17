import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/repositories/database.module';
import { CreateTransactionUseCase } from './create/create-transaction.usecase';
import { ListTransactionsUseCase } from './list/list-transactions.usecase';
import { DeleteTransactionUseCase } from './delete/delete-transaction.usecase';
import { UpdateTransactionUseCase } from './update/update-transaction.usecase';
import { GetSummaryUseCase } from './summary/get-summary.usecase';
import { GetExpensesByCategoryUseCase } from './by-category/get-expenses-by-category.usecase';

@Module({
  imports: [DatabaseModule],
  providers: [
    CreateTransactionUseCase,
    ListTransactionsUseCase,
    DeleteTransactionUseCase,
    UpdateTransactionUseCase,
    GetSummaryUseCase,
    GetExpensesByCategoryUseCase,
  ],
  exports: [
    CreateTransactionUseCase,
    ListTransactionsUseCase,
    DeleteTransactionUseCase,
    UpdateTransactionUseCase,
    GetSummaryUseCase,
    GetExpensesByCategoryUseCase,
  ],
})
export class TransactionUsecaseModule {}
