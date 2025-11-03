import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/services/database/prisma/prisma.service';
import type { RecurringTransactionRepository } from 'src/domain/repositories/recurring-transaction.repository.interface';
import { RecurringTransaction } from 'src/domain/entities/recurring-transaction/recurring-transaction.entity';

@Injectable()
export class PrismaRecurringTransactionRepository
  implements RecurringTransactionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    recurringTransaction: RecurringTransaction,
  ): Promise<RecurringTransaction> {
    const data = await this.prisma.recurringTransaction.create({
      data: {
        id: recurringTransaction.getId(),
        userId: recurringTransaction.getUserId(),
        type: recurringTransaction.getType(),
        category: recurringTransaction.getCategory(),
        paymentMethod: recurringTransaction.getPaymentMethod(),
        amount: recurringTransaction.getAmount(),
        description: recurringTransaction.getDescription(),
        frequency: recurringTransaction.getFrequency(),
        startDate: recurringTransaction.getStartDate(),
        endDate: recurringTransaction.getEndDate(),
        dayOfMonth: recurringTransaction.getDayOfMonth(),
        dayOfWeek: recurringTransaction.getDayOfWeek(),
        active: recurringTransaction.isActive(),
        lastProcessed: recurringTransaction.getLastProcessed(),
        createdAt: recurringTransaction.getCreatedAt(),
        updatedAt: recurringTransaction.getUpdatedAt(),
      },
    });

    return RecurringTransaction.with({
      id: data.id,
      userId: data.userId,
      type: data.type as any,
      category: data.category as any,
      paymentMethod: data.paymentMethod as any,
      amount: data.amount,
      description: data.description,
      frequency: data.frequency as any,
      startDate: data.startDate,
      endDate: data.endDate,
      dayOfMonth: data.dayOfMonth,
      dayOfWeek: data.dayOfWeek,
      active: data.active,
      lastProcessed: data.lastProcessed,
      deletedAt: data.deletedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async findById(id: string): Promise<RecurringTransaction | null> {
    const data = await this.prisma.recurringTransaction.findUnique({
      where: { id, deletedAt: null },
    });

    if (!data) return null;

    return RecurringTransaction.with({
      id: data.id,
      userId: data.userId,
      type: data.type as any,
      category: data.category as any,
      paymentMethod: data.paymentMethod as any,
      amount: data.amount,
      description: data.description,
      frequency: data.frequency as any,
      startDate: data.startDate,
      endDate: data.endDate,
      dayOfMonth: data.dayOfMonth,
      dayOfWeek: data.dayOfWeek,
      active: data.active,
      lastProcessed: data.lastProcessed,
      deletedAt: data.deletedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<RecurringTransaction[]> {
    const data = await this.prisma.recurringTransaction.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((item) =>
      RecurringTransaction.with({
        id: item.id,
        userId: item.userId,
        type: item.type as any,
        category: item.category as any,
        paymentMethod: item.paymentMethod as any,
        amount: item.amount,
        description: item.description,
        frequency: item.frequency as any,
        startDate: item.startDate,
        endDate: item.endDate,
        dayOfMonth: item.dayOfMonth,
        dayOfWeek: item.dayOfWeek,
        active: item.active,
        lastProcessed: item.lastProcessed,
        deletedAt: item.deletedAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }),
    );
  }

  async findActiveByUserId(userId: string): Promise<RecurringTransaction[]> {
    const data = await this.prisma.recurringTransaction.findMany({
      where: { userId, active: true, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((item) =>
      RecurringTransaction.with({
        id: item.id,
        userId: item.userId,
        type: item.type as any,
        category: item.category as any,
        paymentMethod: item.paymentMethod as any,
        amount: item.amount,
        description: item.description,
        frequency: item.frequency as any,
        startDate: item.startDate,
        endDate: item.endDate,
        dayOfMonth: item.dayOfMonth,
        dayOfWeek: item.dayOfWeek,
        active: item.active,
        lastProcessed: item.lastProcessed,
        deletedAt: item.deletedAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }),
    );
  }

  async findActiveDueForProcessing(): Promise<RecurringTransaction[]> {
    const now = new Date();

    const data = await this.prisma.recurringTransaction.findMany({
      where: {
        active: true,
        deletedAt: null,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
    });

    return data.map((item) =>
      RecurringTransaction.with({
        id: item.id,
        userId: item.userId,
        type: item.type as any,
        category: item.category as any,
        paymentMethod: item.paymentMethod as any,
        amount: item.amount,
        description: item.description,
        frequency: item.frequency as any,
        startDate: item.startDate,
        endDate: item.endDate,
        dayOfMonth: item.dayOfMonth,
        dayOfWeek: item.dayOfWeek,
        active: item.active,
        lastProcessed: item.lastProcessed,
        deletedAt: item.deletedAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }),
    );
  }

  async update(
    recurringTransaction: RecurringTransaction,
  ): Promise<RecurringTransaction> {
    const data = await this.prisma.recurringTransaction.update({
      where: { id: recurringTransaction.getId() },
      data: {
        type: recurringTransaction.getType(),
        category: recurringTransaction.getCategory(),
        paymentMethod: recurringTransaction.getPaymentMethod(),
        amount: recurringTransaction.getAmount(),
        description: recurringTransaction.getDescription(),
        frequency: recurringTransaction.getFrequency(),
        startDate: recurringTransaction.getStartDate(),
        endDate: recurringTransaction.getEndDate(),
        dayOfMonth: recurringTransaction.getDayOfMonth(),
        dayOfWeek: recurringTransaction.getDayOfWeek(),
        active: recurringTransaction.isActive(),
        lastProcessed: recurringTransaction.getLastProcessed(),
        deletedAt: recurringTransaction.getDeletedAt(),
        updatedAt: new Date(),
      },
    });

    return RecurringTransaction.with({
      id: data.id,
      userId: data.userId,
      type: data.type as any,
      category: data.category as any,
      paymentMethod: data.paymentMethod as any,
      amount: data.amount,
      description: data.description,
      frequency: data.frequency as any,
      startDate: data.startDate,
      endDate: data.endDate,
      dayOfMonth: data.dayOfMonth,
      dayOfWeek: data.dayOfWeek,
      active: data.active,
      lastProcessed: data.lastProcessed,
      deletedAt: data.deletedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.recurringTransaction.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
