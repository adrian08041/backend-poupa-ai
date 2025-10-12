import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from 'src/infra/services/jwt/jwt.service';
import { IS_PUBLIC } from './decorators/is-public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.exctractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('User not authenticated');
    }

    const payload = this.jwtService.verifyAuthToken(token);

    if (!payload) {
      throw new UnauthorizedException('User not authenticated');
    }

    request['userId'] = payload.userId;

    return true;
  }

  // authorization: Bearer <token>

  private exctractTokenFromRequest(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export const AuthGuardProvider = {
  provide: APP_GUARD,
  useClass: AuthGuard,
};
