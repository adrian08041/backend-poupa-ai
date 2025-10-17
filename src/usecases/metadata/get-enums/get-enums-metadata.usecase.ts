import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/usecases/usecase';
import {
  EnumsMetadata,
  MetadataGateway,
} from 'src/domain/repositories/metadata.gateway';

type InputDto = void;
type OutputDto = EnumsMetadata;

@Injectable()
export class GetEnumsMetadataUsecase implements UseCase<InputDto, OutputDto> {
  constructor(private readonly metadataGateway: MetadataGateway) {}

  async execute(): Promise<OutputDto> {
    return await this.metadataGateway.getEnums();
  }
}
