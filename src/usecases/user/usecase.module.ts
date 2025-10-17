import { FindUserUseCase } from './find-by-id/find-user.usecase';
import { CreateUserUseCase } from './create/create-user.usecase';
import { RefreshAuthTokenUserUsecase } from './refresh-acess-token/refresh-acess-token-user.usecase';
import { LoginUserUsecase } from './login/login-user.usecase';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/repositories/database.module';
import { ServiceModule } from 'src/infra/services/service.module';
import { GetEnumsMetadataUsecase } from '../metadata/get-enums/get-enums-metadata.usecase';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [
    FindUserUseCase,
    CreateUserUseCase,
    RefreshAuthTokenUserUsecase,
    LoginUserUsecase,
    GetEnumsMetadataUsecase,
  ],
  exports: [
    FindUserUseCase,
    CreateUserUseCase,
    RefreshAuthTokenUserUsecase,
    LoginUserUsecase,
    GetEnumsMetadataUsecase,
  ],
})
export class UsecaseModule {}
