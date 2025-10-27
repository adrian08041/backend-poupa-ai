import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/repositories/database.module';
import { ExtractionServiceModule } from 'src/infra/services/extraction/extraction-service.module';
import { CreateTransactionUseCase } from './create/create-transaction.usecase';
import { ListTransactionsUseCase } from './list/list-transactions.usecase';
import { DeleteTransactionUseCase } from './delete/delete-transaction.usecase';
import { UpdateTransactionUseCase } from './update/update-transaction.usecase';
import { GetSummaryUseCase } from './summary/get-summary.usecase';
import { GetExpensesByCategoryUseCase } from './by-category/get-expenses-by-category.usecase';
import { ExtractTransactionFromImageUseCase } from './extract-from-image/extract-transaction-from-image.usecase';

@Module({
  imports: [DatabaseModule, ExtractionServiceModule],
  providers: [
    CreateTransactionUseCase,
    ListTransactionsUseCase,
    DeleteTransactionUseCase,
    UpdateTransactionUseCase,
    GetSummaryUseCase,
    GetExpensesByCategoryUseCase,
    ExtractTransactionFromImageUseCase,
  ],
  exports: [
    CreateTransactionUseCase,
    ListTransactionsUseCase,
    DeleteTransactionUseCase,
    UpdateTransactionUseCase,
    GetSummaryUseCase,
    GetExpensesByCategoryUseCase,
    ExtractTransactionFromImageUseCase,
  ],
})
export class TransactionUsecaseModule {}
