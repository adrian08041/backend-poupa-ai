-- Query para verificar transações deletadas
SELECT 
  id, 
  description, 
  amount, 
  "recurringTransactionId",
  "deletedAt"
FROM "Transaction"
WHERE "recurringTransactionId" IS NOT NULL
ORDER BY "createdAt" DESC
LIMIT 10;
