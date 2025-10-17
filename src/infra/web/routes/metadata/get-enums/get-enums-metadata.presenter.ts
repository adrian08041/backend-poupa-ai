import { EnumsMetadata } from 'src/domain/repositories/metadata.gateway';
import { GetEnumsMetadataOutputDto } from './get-enums-metadata.dto';

export class GetEnumsMetadataPresenter {
  static toHttp(output: EnumsMetadata): GetEnumsMetadataOutputDto {
    return {
      transactionTypes: output.transactionTypes,
      transactionCategories: output.transactionCategories,
      paymentMethods: output.paymentMethods,
    };
  }
}
