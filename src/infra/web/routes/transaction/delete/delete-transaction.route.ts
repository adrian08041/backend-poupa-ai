import { Controller, Delete, Param } from '@nestjs/common';
import type { DeleteTransactionRouteResponse } from './delete-transaction.dto';
import { DeleteTransactionPresenter } from './delete-transaction.presenter';
import { UserId } from 'src/infra/web/auth/decorators/user-id.decorator';
import {
  DeleteTransactionInput,
  DeleteTransactionUseCase,
} from 'src/usecases/transaction/delete/delete-transaction.usecase';

@Controller('transactions')
export class DeleteTransactionRoute {
  public constructor(
    private readonly deleteTransactionUsecase: DeleteTransactionUseCase,
  ) {}

  @Delete(':id')
  public async handle(
    @Param('id') transactionId: string,
    @UserId() userId: string,
  ): Promise<DeleteTransactionRouteResponse> {
    const input: DeleteTransactionInput = {
      transactionId,
      userId,
    };

    const result = await this.deleteTransactionUsecase.execute(input);

    const response = DeleteTransactionPresenter.toHttp(result);

    return response;
  }
}
