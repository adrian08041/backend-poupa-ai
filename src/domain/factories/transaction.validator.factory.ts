import { TransactionZodValidator } from '../validators/transaction.zod.validator';

/**
 * 🏭 FACTORY DE VALIDADOR DE TRANSAÇÃO
 *
 * CONCEITO:
 * - Factory Method Pattern para criar validadores
 * - Encapsula a criação do Zod Schema
 * - Seguindo o padrão: user-password.validator.factory.ts
 *
 * POR QUE?
 * - Separação de responsabilidades
 * - Facilita troca de biblioteca de validação no futuro
 * - Ponto único de criação de validadores
 */

export class TransactionValidatorFactory {
  public static create() {
    return TransactionZodValidator;
  }
}
