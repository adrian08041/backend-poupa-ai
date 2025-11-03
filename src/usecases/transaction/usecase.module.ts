import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/repositories/database.module';
import { ExtractionServiceModule } from 'src/infra/services/extraction/extraction-service.module';
import { AiInsightsModule } from 'src/infra/services/ai-insights/ai-insights.module';
import { CreateTransactionUseCase } from './create/create-transaction.usecase';
import { ListTransactionsUseCase } from './list/list-transactions.usecase';
import { DeleteTransactionUseCase } from './delete/delete-transaction.usecase';
import { UpdateTransactionUseCase } from './update/update-transaction.usecase';
import { GetSummaryUseCase } from './summary/get-summary.usecase';
import { GetExpensesByCategoryUseCase } from './by-category/get-expenses-by-category.usecase';
import { ExtractTransactionFromImageUseCase } from './extract-from-image/extract-transaction-from-image.usecase';
import { GenerateReportUsecase } from './generate-report/generate-report.usecase';
import { RecurringTransactionUsecaseModule } from '../recurring-transaction/usecase.module';

@Module({
  imports: [
    DatabaseModule,
    ExtractionServiceModule,
    AiInsightsModule,
    forwardRef(() => RecurringTransactionUsecaseModule),
  ],
  providers: [
    CreateTransactionUseCase,
    ListTransactionsUseCase,
    DeleteTransactionUseCase,
    UpdateTransactionUseCase,
    GetSummaryUseCase,
    GetExpensesByCategoryUseCase,
    ExtractTransactionFromImageUseCase,
    GenerateReportUsecase,
  ],
  exports: [
    CreateTransactionUseCase,
    ListTransactionsUseCase,
    DeleteTransactionUseCase,
    UpdateTransactionUseCase,
    GetSummaryUseCase,
    GetExpensesByCategoryUseCase,
    ExtractTransactionFromImageUseCase,
    GenerateReportUsecase,
  ],
})
export class TransactionUsecaseModule {}
