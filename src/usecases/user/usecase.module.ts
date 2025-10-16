import { FindUserUseCase } from './find-by-id/find-user.usecase';
import { CreateUserUseCase } from './create/create-user.usecase';
import { RefreshAuthTokenUserUsecase } from './refresh-acess-token/refresh-acess-token-user.usecase';
import { LoginUserUsecase } from './login/login-user.usecase';
import { CreateTransactionUseCase } from '../transaction/create/create-transaction.usecase';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/repositories/database.module';
import { ServiceModule } from 'src/infra/services/service.module';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [
    FindUserUseCase,
    CreateUserUseCase,
    RefreshAuthTokenUserUsecase,
    LoginUserUsecase,
    CreateTransactionUseCase,
  ],
  exports: [
    FindUserUseCase,
    CreateUserUseCase,
    RefreshAuthTokenUserUsecase,
    LoginUserUsecase,
    CreateTransactionUseCase,
  ],
})
export class UsecaseModule {}
