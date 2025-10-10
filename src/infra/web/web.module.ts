import { Module } from '@nestjs/common';
import { CreateUserRoute } from './routes/user/create/create-user.route';
import { UsecaseModule } from 'src/usecases/user/usecase.module';
import { ValidatorDomainExceptionFilter } from './filters/validator-domain.exception.filter';

@Module({
  imports: [UsecaseModule],
  controllers: [CreateUserRoute],
  providers: [ValidatorDomainExceptionFilter],
})
export class WebModule {}
