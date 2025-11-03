import { RecurringTransactionZodValidator } from '../validators/recurring-transaction.zod.validator';

/**
 * Factory Method Pattern para criar validadores de transação recorrente
 *
 * CONCEITO:
 * - Factory Method Pattern para criar validadores
 * - Encapsula a criação do Zod Schema
 * - Ponto único de criação de validadores
 *
 * POR QUE?
 * - Separação de responsabilidades
 * - Facilita troca de biblioteca de validação no futuro
 */

export class RecurringTransactionValidatorFactory {
  public static create() {
    return RecurringTransactionZodValidator;
  }
}
