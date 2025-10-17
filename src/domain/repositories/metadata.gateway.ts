export type EnumsMetadata = {
  transactionTypes: string[];
  transactionCategories: string[];
  paymentMethods: string[];
};

export abstract class MetadataGateway {
  abstract getEnums(): Promise<EnumsMetadata>;
}
