-- CreateEnum
CREATE TYPE "RecurrenceFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "recurringTransactionId" TEXT;

-- CreateTable
CREATE TABLE "recurring_transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "category" "TransactionCategory" NOT NULL,
    "paymentMethod" "PaymentMethod",
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "frequency" "RecurrenceFrequency" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "dayOfMonth" INTEGER,
    "dayOfWeek" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastProcessed" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recurring_transaction_userId_idx" ON "recurring_transaction"("userId");

-- CreateIndex
CREATE INDEX "recurring_transaction_active_idx" ON "recurring_transaction"("active");

-- CreateIndex
CREATE INDEX "recurring_transaction_frequency_idx" ON "recurring_transaction"("frequency");

-- CreateIndex
CREATE INDEX "recurring_transaction_deletedAt_idx" ON "recurring_transaction"("deletedAt");

-- CreateIndex
CREATE INDEX "transaction_recurringTransactionId_idx" ON "transaction"("recurringTransactionId");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_recurringTransactionId_fkey" FOREIGN KEY ("recurringTransactionId") REFERENCES "recurring_transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_transaction" ADD CONSTRAINT "recurring_transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
