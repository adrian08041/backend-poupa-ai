import { Injectable } from '@nestjs/common';
import {
  CategorySummary,
  TransactionGateway,
  TransactionSummary,
} from 'src/domain/repositories/transaction.gateway';
import { Transaction } from 'src/domain/entities/transaction/transaction.entity';
import { prismaClient } from '../client.prisma';
import { TransactionEntityToPrismaModelMapper } from './model/mappers/transaction-entity-to-prisma-model.mapper';
import { TransactionPrismaModelToEntityMapper } from './model/mappers/transaction-prisma-model-to-entity.mapper';

@Injectable()
export class TransactionPrismaRepository extends TransactionGateway {
  public constructor() {
    super();
  }

  public async create(transaction: Transaction): Promise<void> {
    const model = TransactionEntityToPrismaModelMapper.map(transaction);

    console.log('🧩 Dados enviados para o Prisma:', model);

    try {
      await prismaClient.transaction.create({
        data: model,
      });
      console.log('✅ Transação criada no banco com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao criar transação no banco:', error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Transaction | null> {
    const model = await prismaClient.transaction.findUnique({
      where: {
        id: id,
      },
    });

    if (!model) {
      return null;
    }

    const transaction = TransactionPrismaModelToEntityMapper.map(model);

    return transaction;
  }

  public async findByUserId(userId: string): Promise<Transaction[]> {
    const models = await prismaClient.transaction.findMany({
      where: {
        userId: userId,
        deletedAt: null,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const transactions = models.map((model) =>
      TransactionPrismaModelToEntityMapper.map(model),
    );

    return transactions;
  }

  public async update(transaction: Transaction): Promise<void> {
    const model = TransactionEntityToPrismaModelMapper.map(transaction);

    await prismaClient.transaction.update({
      where: {
        id: transaction.getId(),
      },
      data: {
        type: model.type,
        category: model.category,
        paymentMethod: model.paymentMethod,
        amount: model.amount,
        description: model.description,
        date: model.date,
        updatedAt: new Date(),
      },
    });
  }

  public async softDelete(id: string): Promise<void> {
    await prismaClient.transaction.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  public async getSummaryByUserId(
    userId: string,
  ): Promise<TransactionSummary> {
    const result = await prismaClient.transaction.groupBy({
      by: ['type'],
      where: {
        userId: userId,
        deletedAt: null,
      },
      _sum: {
        amount: true,
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let totalInvestment = 0;

    result.forEach((group) => {
      const amount = group._sum.amount || 0;

      if (group.type === 'INCOME') {
        totalIncome = amount;
      } else if (group.type === 'EXPENSE') {
        totalExpense = amount;
      } else if (group.type === 'INVESTMENT') {
        totalInvestment = amount;
      }
    });

    // Saldo = Receitas - Despesas (investimento não afeta o saldo)
    const balance = totalIncome - totalExpense;

    return {
      balance,
      totalIncome,
      totalExpense,
      totalInvestment,
    };
  }

  public async getExpensesByCategory(
    userId: string,
  ): Promise<CategorySummary[]> {
    const result = await prismaClient.transaction.groupBy({
      by: ['category'],
      where: {
        userId: userId,
        type: 'EXPENSE',
        deletedAt: null,
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    // Calcula total de despesas para percentuais
    const totalExpenses = result.reduce(
      (sum, group) => sum + (group._sum.amount || 0),
      0,
    );

    const summaries: CategorySummary[] = result.map((group) => {
      const amount = group._sum.amount || 0;
      const percentage =
        totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;

      return {
        category: group.category,
        amount: amount,
        percentage: Math.round(percentage * 100) / 100, // 2 casas decimais
        count: group._count.id,
      };
    });

    // Ordena por valor (maior para menor)
    summaries.sort((a, b) => b.amount - a.amount);

    return summaries;
  }

  public async findByUserIdAndPeriod(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    const models = await prismaClient.transaction.findMany({
      where: {
        userId: userId,
        deletedAt: null,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    const transactions = models.map((model) =>
      TransactionPrismaModelToEntityMapper.map(model),
    );

    return transactions;
  }
}
