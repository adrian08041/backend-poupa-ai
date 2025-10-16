export type TransactionType = 'INCOME' | 'EXPENSE';

export type TransactionCategory =
  // Despesas
  | 'ALIMENTACAO'
  | 'TRANSPORTE'
  | 'LAZER'
  | 'SAUDE'
  | 'EDUCACAO'
  | 'MORADIA'
  | 'VESTUARIO'
  // Receitas
  | 'SALARIO'
  | 'FREELANCE'
  | 'INVESTIMENTO'
  | 'PRESENTE'
  // Genérico
  | 'OUTROS';

export type TransactionProps = {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number; // Em centavos
  description?: string;
  date: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export class Transaction {
  private props: TransactionProps;

  private constructor(props: TransactionProps) {
    this.props = props;
  }

  // Factory method - cria uma nova transação
  public static create(
    data: Omit<
      TransactionProps,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): Transaction {
    // Validações de domínio
    this.validate(data);

    return new Transaction({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Factory method - reconstrói transação do banco
  public static from(props: TransactionProps): Transaction {
    return new Transaction(props);
  }

  // Validações de domínio
  private static validate(
    data: Omit<
      TransactionProps,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): void {
    // Valor deve ser positivo
    if (data.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    // Data não pode ser futura
    if (data.date > new Date()) {
      throw new Error('Transaction date cannot be in the future');
    }

    // Descrição não pode ser muito longa
    if (data.description && data.description.length > 500) {
      throw new Error('Description cannot exceed 500 characters');
    }
  }

  // Getters
  public get id(): string {
    return this.props.id;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get type(): TransactionType {
    return this.props.type;
  }

  public get category(): TransactionCategory {
    return this.props.category;
  }

  public get amount(): number {
    return this.props.amount;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get date(): Date {
    return this.props.date;
  }

  public get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Método de negócio - marca como deletada (soft delete)
  public delete(): void {
    this.props.deletedAt = new Date();
    this.props.updatedAt = new Date();
  }

  // Método de negócio - atualiza a transação
  public update(data: {
    type?: TransactionType;
    category?: TransactionCategory;
    amount?: number;
    description?: string;
    date?: Date;
  }): void {
    if (this.props.deletedAt) {
      throw new Error('Cannot update a deleted transaction');
    }

    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    if (data.date && data.date > new Date()) {
      throw new Error('Transaction date cannot be in the future');
    }

    if (data.description && data.description.length > 500) {
      throw new Error('Description cannot exceed 500 characters');
    }

    // Atualiza apenas os campos fornecidos
    if (data.type !== undefined) this.props.type = data.type;
    if (data.category !== undefined) this.props.category = data.category;
    if (data.amount !== undefined) this.props.amount = data.amount;
    if (data.description !== undefined)
      this.props.description = data.description;
    if (data.date !== undefined) this.props.date = data.date;

    this.props.updatedAt = new Date();
  }

  // Verifica se está deletada
  public isDeleted(): boolean {
    return this.props.deletedAt !== undefined;
  }

  // Converte para objeto simples
  public toJSON(): TransactionProps {
    return { ...this.props };
  }
}
