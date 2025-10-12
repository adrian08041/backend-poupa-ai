import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';

type UserIdRequestType = Request & { userId?: string };

export const UserId = createParamDecorator<undefined>(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<UserIdRequestType>();
    const userId = request?.userId;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return userId;
  },
);
