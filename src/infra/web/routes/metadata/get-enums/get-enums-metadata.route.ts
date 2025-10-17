import { Controller, Get } from '@nestjs/common';
import { GetEnumsMetadataUsecase } from 'src/usecases/metadata/get-enums/get-enums-metadata.usecase';
import { IsPublic } from 'src/infra/web/auth/decorators/is-public.decorator';
import { GetEnumsMetadataPresenter } from './get-enums-metadata.presenter';
import { GetEnumsMetadataOutputDto } from './get-enums-metadata.dto';

@Controller('meta')
export class GetEnumsMetadataRoute {
  constructor(
    private readonly getEnumsMetadataUsecase: GetEnumsMetadataUsecase,
  ) {}

  @Get('enums')
  @IsPublic()
  async handle(): Promise<GetEnumsMetadataOutputDto> {
    const output = await this.getEnumsMetadataUsecase.execute();
    return GetEnumsMetadataPresenter.toHttp(output);
  }
}
