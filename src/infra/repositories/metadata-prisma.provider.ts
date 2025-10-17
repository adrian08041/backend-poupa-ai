import { Provider } from '@nestjs/common';
import { MetadataGateway } from 'src/domain/repositories/metadata.gateway';
import { MetadataPrismaRepository } from './metadata-prisma.repository';

export const MetadataPrismaRepositoryProvider: Provider = {
  provide: MetadataGateway,
  useClass: MetadataPrismaRepository,
};
