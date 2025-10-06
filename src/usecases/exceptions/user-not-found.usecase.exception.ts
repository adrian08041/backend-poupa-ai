import { UsecaseException } from './usecase.exception';

export class UserNotFoundUsecaseException extends UsecaseException {
  public constructor(
    intertnalMessage: string,
    externalMessage: string,
    context: string,
  ) {
    super(intertnalMessage, externalMessage, context);
  }
}
