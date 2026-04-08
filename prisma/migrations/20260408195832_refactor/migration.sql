-- DropIndex
DROP INDEX "public"."transaction_date_idx";

-- DropIndex
DROP INDEX "public"."transaction_deletedAt_idx";

-- DropIndex
DROP INDEX "public"."transaction_recurringTransactionId_idx";

-- DropIndex
DROP INDEX "public"."transaction_type_idx";

-- DropIndex
DROP INDEX "public"."transaction_userId_idx";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "tokenVersion" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "replacedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_tokenHash_key" ON "refresh_token"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_token_userId_idx" ON "refresh_token"("userId");

-- CreateIndex
CREATE INDEX "refresh_token_tokenHash_idx" ON "refresh_token"("tokenHash");

-- CreateIndex
CREATE INDEX "transaction_userId_deletedAt_date_idx" ON "transaction"("userId", "deletedAt", "date" DESC);

-- CreateIndex
CREATE INDEX "transaction_userId_deletedAt_type_idx" ON "transaction"("userId", "deletedAt", "type");

-- CreateIndex
CREATE INDEX "transaction_userId_deletedAt_type_category_idx" ON "transaction"("userId", "deletedAt", "type", "category");

-- CreateIndex
CREATE INDEX "transaction_recurringTransactionId_deletedAt_idx" ON "transaction"("recurringTransactionId", "deletedAt");

-- CreateIndex
CREATE INDEX "transaction_userId_date_idx" ON "transaction"("userId", "date");

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
