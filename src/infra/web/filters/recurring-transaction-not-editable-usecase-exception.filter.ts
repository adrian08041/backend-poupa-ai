import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Response } from 'express';
import { ExceptionUtils } from 'src/shared/utils/exception-utils';
import { LogUtils } from 'src/shared/utils/log-utils';
import { RecurringTransactionNotEditableUsecaseException } from 'src/usecases/exceptions/recurring-transaction-not-editable.usecase.exception';

@Catch(RecurringTransactionNotEditableUsecaseException)
export class RecurringTransactionNotEditableUsecaseExceptionFilter
  implements ExceptionFilter
{
  public catch(
    exception: RecurringTransactionNotEditableUsecaseException,
    host: ArgumentsHost,
  ) {
    LogUtils.logException(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.FORBIDDEN;

    const aResponseData = ExceptionUtils.buildErrorResponse(exception, status);

    response.status(status).json(aResponseData);
  }
}

export const RecurringTransactionNotEditableUsecaseExceptionFilterProvider = {
  provide: APP_FILTER,
  useClass: RecurringTransactionNotEditableUsecaseExceptionFilter,
};
