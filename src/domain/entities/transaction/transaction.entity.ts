import { Entity } from 'src/domain/shared/entities/entity';
import { Utils } from 'src/shared/utils/utils';
import { TransactionValidatorFactory } from 'src/domain/factories/transaction.validator.factory';
import { ValidatorDomainException } from 'src/domain/shared/exception/validator-domain.exception';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'INVESTMENT';

export type TransactionCategory =
  | 'ALIMENTACAO'
  | 'TRANSPORTE'
  | 'LAZER'
  | 'SAUDE'
  | 'EDUCACAO'
  | 'MORADIA'
  | 'VESTUARIO'
  | 'SALARIO'
  | 'FREELANCE'
  | 'INVESTIMENTO'
  | 'PRESENTE'
  | 'OUTROS';

export type PaymentMethod =
  | 'PIX'
  | 'BOLETO'
  | 'CARTAO'
  | 'TRANSFERENCIA'
  | 'DINHEIRO';

export type TransactionCreateDto = {
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod?: PaymentMethod;
  amount: number; // Em centavos
  description?: string;
  date: Date;
};

export type TransactionWithDto = {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: PaymentMethod | null;
  amount: number; // Em centavos
  description: string | null;
  date: Date;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export class Transaction extends Entity {
  private constructor(
    id: string,
    private userId: string,
    private type: TransactionType,
    private category: TransactionCategory,
    private paymentMethod: PaymentMethod | null,
    private amount: number,
    private description: string | null,
    private date: Date,
    private deletedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.validate();
  }

  public static create({
    userId,
    type,
    category,
    paymentMethod = undefined,
    amount,
    description = undefined,
    date,
  }: TransactionCreateDto): Transaction {
    const id = Utils.generateUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return new Transaction(
      id,
      userId,
      type,
      category,
      paymentMethod ?? null,
      amount,
      description ?? null,
      date,
      null, // deletedAt
      createdAt,
      updatedAt,
    );
  }

  public static with({
    id,
    userId,
    type,
    category,
    paymentMethod,
    amount,
    description,
    date,
    deletedAt,
    createdAt,
    updatedAt,
  }: TransactionWithDto): Transaction {
    return new Transaction(
      id,
      userId,
      type,
      category,
      paymentMethod,
      amount,
      description,
      date,
      deletedAt,
      createdAt,
      updatedAt,
    );
  }

  protected validate(): void {
    const validator = TransactionValidatorFactory.create();

    const result = validator.safeParse({
      userId: this.userId,
      type: this.type,
      category: this.category,
      paymentMethod: this.paymentMethod,
      amount: this.amount,
      description: this.description,
      date: this.date,
    });

    if (!result.success) {
      const firstError = result.error.issues[0];
      throw new ValidatorDomainException(
        `Transaction validation failed: ${firstError.path.join('.')} - ${firstError.message}`,
        firstError.message,
      );
    }
  }

  public getUserId(): string {
    return this.userId;
  }

  public getType(): TransactionType {
    return this.type;
  }

  public getCategory(): TransactionCategory {
    return this.category;
  }

  public getPaymentMethod(): PaymentMethod | null {
    return this.paymentMethod;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public getDate(): Date {
    return this.date;
  }

  public getDeletedAt(): Date | null {
    return this.deletedAt;
  }
}
