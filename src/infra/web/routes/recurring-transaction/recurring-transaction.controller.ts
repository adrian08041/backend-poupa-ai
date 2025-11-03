import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from 'src/infra/web/auth/auth.guard';
import { CreateRecurringTransactionUsecase } from 'src/usecases/recurring-transaction/create/create-recurring-transaction.usecase';
import { ListRecurringTransactionsUsecase } from 'src/usecases/recurring-transaction/list/list-recurring-transactions.usecase';
import { ToggleRecurringTransactionUsecase } from 'src/usecases/recurring-transaction/toggle/toggle-recurring-transaction.usecase';
import { DeleteRecurringTransactionUsecase } from 'src/usecases/recurring-transaction/delete/delete-recurring-transaction.usecase';
import { RecurringTransactionProcessorService } from 'src/usecases/recurring-transaction/process/recurring-transaction-processor.service';

@Controller('recurring-transactions')
@UseGuards(AuthGuard)
export class RecurringTransactionController {
  constructor(
    private readonly createUsecase: CreateRecurringTransactionUsecase,
    private readonly listUsecase: ListRecurringTransactionsUsecase,
    private readonly toggleUsecase: ToggleRecurringTransactionUsecase,
    private readonly deleteUsecase: DeleteRecurringTransactionUsecase,
    private readonly processorService: RecurringTransactionProcessorService,
  ) {}

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const result = await this.createUsecase.execute({
      userId: req.userId,
      type: body.type,
      category: body.category,
      paymentMethod: body.paymentMethod,
      amount: body.amount,
      description: body.description,
      frequency: body.frequency,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      dayOfMonth: body.dayOfMonth,
      dayOfWeek: body.dayOfWeek,
    });

    return result;
  }

  @Get()
  async list(@Req() req: any) {
    const result = await this.listUsecase.execute({
      userId: req.userId,
      activeOnly: false,
    });

    return result;
  }

  @Put(':id/toggle')
  async toggle(@Req() req: any, @Param('id') id: string) {
    const result = await this.toggleUsecase.execute({
      id,
      userId: req.userId,
    });

    return result;
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    const result = await this.deleteUsecase.execute({
      id,
      userId: req.userId,
    });

    return result;
  }

  @Post('process')
  async processNow(@Req() req: any) {
    const result = await this.processorService.processNow(req.userId);
    return result;
  }
}
