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
import { UnauthorizedTransactionAccessUsecaseException } from 'src/usecases/exceptions/unauthorized-transaction-access.usecase.exception';

@Catch(UnauthorizedTransactionAccessUsecaseException)
export class UnauthorizedTransactionAccessUsecaseExceptionFilter
  implements ExceptionFilter
{
  public catch(
    exception: UnauthorizedTransactionAccessUsecaseException,
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

export const UnauthorizedTransactionAccessUsecaseExceptionFilterProvider = {
  provide: APP_FILTER,
  useClass: UnauthorizedTransactionAccessUsecaseExceptionFilter,
};
