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

@Module({
  imports: [UsecaseModule],
  controllers: [CreateUserRoute],
  providers: [
    ValidatorDomainExceptionFilterProvider,
    DomainExceptionFilterProvider,
    UsecaseExceptionFilterProvider,
    CredentialsNotValidUsecaseExceptionFilterProvider,
    EmailAlreadyExistsUsecaseExceptionFilterProvider,
    UsecaseExceptionFilterProvider,
    UserNotFoundUsecaseExceptionFilterProvider,
    ServiceExceptionFilterProvider,
    RefreshTokenNotValidServiceExceptionFilterProvider,
  ],
})
export class WebModule {}
