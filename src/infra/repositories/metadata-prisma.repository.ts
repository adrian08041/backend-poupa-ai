import { Injectable } from '@nestjs/common';
import {
  EnumsMetadata,
  MetadataGateway,
} from 'src/domain/repositories/metadata.gateway';
import {
  TransactionType,
  TransactionCategory,
  PaymentMethod,
} from 'generated/prisma';

@Injectable()
export class MetadataPrismaRepository extends MetadataGateway {
  async getEnums(): Promise<EnumsMetadata> {
    return {
      transactionTypes: Object.values(TransactionType),
      transactionCategories: Object.values(TransactionCategory),
      paymentMethods: Object.values(PaymentMethod),
    };
  }
}
