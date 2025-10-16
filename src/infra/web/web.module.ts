import { Module } from '@nestjs/common';
import { CreateUserRoute } from './routes/user/create/create-user.route';
import { UsecaseModule } from 'src/usecases/user/usecase.module';
import { ValidatorDomainExceptionFilterProvider } from './filters/validator-domain.exception.filter';
import { DomainExceptionFilterProvider } from './filters/domain-exception.filter';
import { UsecaseExceptionFilterProvider } from './filters/usecase-exception.filter';
import { CredentialsNotValidUsecaseExceptionFilterProvider } from './filters/credentials-not-valid-usecase-exception.filter';
import { EmailAlreadyExistsUsecaseExceptionFilterProvider } from './filters/email-already-exists-usecase-exception.filter';
import { UserNotFoundUsecaseExceptionFilterProvider } from './filters/user-not-found-usecase-exception.filter';
import { ServiceExceptionFilterProvider } from './filters/service-exception.filter';
import { RefreshTokenNotValidServiceExceptionFilterProvider } from './filters/refresh-token-not-valid-service-exception.filter';
import { LoginUserRoute } from './routes/user/login/login-user.route';
import { RefreshAuthTokenRoute } from './routes/user/refresh/refresh-auth-token.route';
import { FindByIdUserRoute } from './routes/user/find-by-id/find-by-id-user.route';
import { AuthGuardProvider } from './auth/auth.guard';
import { ServiceModule } from '../services/service.module';
import { LogoutUserRoute } from './routes/user/logout/logout-user.route';
import { LogoutUserUsecase } from 'src/usecases/user/logout/logout-user.usecase';
import { CreateTransactionRoute } from './routes/transaction/create/create-transaction.route';

@Module({
  imports: [ServiceModule, UsecaseModule],
  controllers: [
    CreateUserRoute,
    LoginUserRoute,
    RefreshAuthTokenRoute,
    FindByIdUserRoute,
    LogoutUserRoute,
    CreateTransactionRoute,
  ],
  providers: [
    AuthGuardProvider,
    ValidatorDomainExceptionFilterProvider,
    DomainExceptionFilterProvider,
    UsecaseExceptionFilterProvider,
    CredentialsNotValidUsecaseExceptionFilterProvider,
    EmailAlreadyExistsUsecaseExceptionFilterProvider,
    UsecaseExceptionFilterProvider,
    UserNotFoundUsecaseExceptionFilterProvider,
    ServiceExceptionFilterProvider,
    RefreshTokenNotValidServiceExceptionFilterProvider,
    LogoutUserUsecase,
  ],
})
export class WebModule {}
