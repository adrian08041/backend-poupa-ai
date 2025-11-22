-- AlterTable
ALTER TABLE "user" ADD COLUMN "whatsappNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_whatsappNumber_key" ON "user"("whatsappNumber");
