-- ============================================================================
-- Script para corrigir dados inválidos após adicionar validação de tipo/categoria
-- Data: 2025-11-03
-- ============================================================================

-- 1. Verificar transações recorrentes com tipo/categoria incompatíveis
-- ============================================================================

-- Verificar INVESTMENT com categoria errada
SELECT id, type, category, description, "userId"
FROM "RecurringTransaction"
WHERE type = 'INVESTMENT' AND category != 'INVESTIMENTO'
  AND "deletedAt" IS NULL;

-- Verificar INCOME com categoria errada
SELECT id, type, category, description, "userId"
FROM "RecurringTransaction"
WHERE type = 'INCOME'
  AND category NOT IN ('SALARIO', 'FREELANCE', 'PRESENTE', 'OUTROS')
  AND "deletedAt" IS NULL;

-- Verificar EXPENSE com categoria errada
SELECT id, type, category, description, "userId"
FROM "RecurringTransaction"
WHERE type = 'EXPENSE'
  AND category NOT IN ('ALIMENTACAO', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO', 'MORADIA', 'VESTUARIO', 'OUTROS')
  AND "deletedAt" IS NULL;

-- 2. Verificar transações com tipo/categoria incompatíveis
-- ============================================================================

-- Verificar INVESTMENT com categoria errada
SELECT id, type, category, description, "userId"
FROM "Transaction"
WHERE type = 'INVESTMENT' AND category != 'INVESTIMENTO'
  AND "deletedAt" IS NULL;

-- Verificar INCOME com categoria errada
SELECT id, type, category, description, "userId"
FROM "Transaction"
WHERE type = 'INCOME'
  AND category NOT IN ('SALARIO', 'FREELANCE', 'PRESENTE', 'OUTROS')
  AND "deletedAt" IS NULL;

-- Verificar EXPENSE com categoria errada
SELECT id, type, category, description, "userId"
FROM "Transaction"
WHERE type = 'EXPENSE'
  AND category NOT IN ('ALIMENTACAO', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO', 'MORADIA', 'VESTUARIO', 'OUTROS')
  AND "deletedAt" IS NULL;

-- ============================================================================
-- 3. CORRIGIR dados inválidos
-- ============================================================================
-- ATENÇÃO: Execute as queries de verificação acima primeiro!
-- Depois execute as queries abaixo para corrigir os dados
-- ============================================================================

-- Corrigir RecurringTransaction com INVESTMENT
UPDATE "RecurringTransaction"
SET category = 'INVESTIMENTO', "updatedAt" = NOW()
WHERE type = 'INVESTMENT'
  AND category != 'INVESTIMENTO'
  AND "deletedAt" IS NULL;

-- Corrigir Transaction com INVESTMENT
UPDATE "Transaction"
SET category = 'INVESTIMENTO', "updatedAt" = NOW()
WHERE type = 'INVESTMENT'
  AND category != 'INVESTIMENTO'
  AND "deletedAt" IS NULL;

-- ============================================================================
-- 4. Corrigir categorias incompatíveis com INCOME
-- ============================================================================

-- Opção 1: Mudar para categoria OUTROS (mais seguro)
UPDATE "RecurringTransaction"
SET category = 'OUTROS', "updatedAt" = NOW()
WHERE type = 'INCOME'
  AND category NOT IN ('SALARIO', 'FREELANCE', 'PRESENTE', 'OUTROS')
  AND "deletedAt" IS NULL;

UPDATE "Transaction"
SET category = 'OUTROS', "updatedAt" = NOW()
WHERE type = 'INCOME'
  AND category NOT IN ('SALARIO', 'FREELANCE', 'PRESENTE', 'OUTROS')
  AND "deletedAt" IS NULL;

-- ============================================================================
-- 5. Corrigir categorias incompatíveis com EXPENSE
-- ============================================================================

-- Opção 1: Mudar para categoria OUTROS (mais seguro)
UPDATE "RecurringTransaction"
SET category = 'OUTROS', "updatedAt" = NOW()
WHERE type = 'EXPENSE'
  AND category NOT IN ('ALIMENTACAO', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO', 'MORADIA', 'VESTUARIO', 'OUTROS')
  AND "deletedAt" IS NULL;

UPDATE "Transaction"
SET category = 'OUTROS', "updatedAt" = NOW()
WHERE type = 'EXPENSE'
  AND category NOT IN ('ALIMENTACAO', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO', 'MORADIA', 'VESTUARIO', 'OUTROS')
  AND "deletedAt" IS NULL;

-- ============================================================================
-- 6. Verificação final - Não deve retornar nenhum resultado
-- ============================================================================

SELECT 'RecurringTransaction com dados inválidos' as tabela, COUNT(*) as total
FROM "RecurringTransaction"
WHERE "deletedAt" IS NULL
  AND (
    (type = 'INVESTMENT' AND category != 'INVESTIMENTO')
    OR (type = 'INCOME' AND category NOT IN ('SALARIO', 'FREELANCE', 'PRESENTE', 'OUTROS'))
    OR (type = 'EXPENSE' AND category NOT IN ('ALIMENTACAO', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO', 'MORADIA', 'VESTUARIO', 'OUTROS'))
  )

UNION ALL

SELECT 'Transaction com dados inválidos' as tabela, COUNT(*) as total
FROM "Transaction"
WHERE "deletedAt" IS NULL
  AND (
    (type = 'INVESTMENT' AND category != 'INVESTIMENTO')
    OR (type = 'INCOME' AND category NOT IN ('SALARIO', 'FREELANCE', 'PRESENTE', 'OUTROS'))
    OR (type = 'EXPENSE' AND category NOT IN ('ALIMENTACAO', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO', 'MORADIA', 'VESTUARIO', 'OUTROS'))
  );

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
