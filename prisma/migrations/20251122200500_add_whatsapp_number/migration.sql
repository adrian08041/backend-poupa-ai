-- AlterTable
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='user' AND column_name='whatsappNumber'
  ) THEN
    ALTER TABLE "user" ADD COLUMN "whatsappNumber" TEXT;
  END IF;
END $$;

-- CreateIndex
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'user_whatsappNumber_key'
  ) THEN
    CREATE UNIQUE INDEX "user_whatsappNumber_key" ON "user"("whatsappNumber");
  END IF;
END $$;
