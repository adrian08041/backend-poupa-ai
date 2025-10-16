-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'BOLETO', 'CARTAO', 'TRANSFERENCIA', 'DINHEIRO');

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "paymentMethod" "PaymentMethod";
