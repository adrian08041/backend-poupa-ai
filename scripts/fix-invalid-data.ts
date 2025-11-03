import { PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();

async function fixInvalidData() {
  console.log('🔍 Iniciando verificação de dados inválidos...\n');

  try {
    // 1. Verificar e corrigir RecurringTransaction com INVESTMENT
    console.log('📊 Verificando RecurringTransaction com tipo INVESTMENT...');
    const invalidRecurringInvestments = await prisma.$queryRaw<
      Array<{ id: string; type: string; category: string; description: string }>
    >`
      SELECT id, type, category, description
      FROM recurring_transaction
      WHERE type = 'INVESTMENT' AND category != 'INVESTIMENTO' AND "deletedAt" IS NULL
    `;

    if (invalidRecurringInvestments.length > 0) {
      console.log(
        `  ⚠️  Encontradas ${invalidRecurringInvestments.length} transações recorrentes inválidas:`,
      );
      invalidRecurringInvestments.forEach((rec) => {
        console.log(
          `    - ID: ${rec.id} | Categoria atual: ${rec.category} | Descrição: ${rec.description}`,
        );
      });

      console.log('  🔧 Corrigindo...');
      const result1 = await prisma.$executeRaw`
        UPDATE recurring_transaction
        SET category = 'INVESTIMENTO', "updatedAt" = NOW()
        WHERE type = 'INVESTMENT' AND category != 'INVESTIMENTO' AND "deletedAt" IS NULL
      `;
      console.log(`  ✅ ${result1} registros corrigidos em RecurringTransaction\n`);
    } else {
      console.log('  ✅ Nenhum problema encontrado\n');
    }

    // 2. Verificar e corrigir Transaction com INVESTMENT
    console.log('📊 Verificando Transaction com tipo INVESTMENT...');
    const invalidTransactionInvestments = await prisma.$queryRaw<
      Array<{ id: string; type: string; category: string; description: string }>
    >`
      SELECT id, type, category, description
      FROM transaction
      WHERE type = 'INVESTMENT' AND category != 'INVESTIMENTO' AND "deletedAt" IS NULL
    `;

    if (invalidTransactionInvestments.length > 0) {
      console.log(
        `  ⚠️  Encontradas ${invalidTransactionInvestments.length} transações inválidas:`,
      );
      invalidTransactionInvestments.forEach((trans) => {
        console.log(
          `    - ID: ${trans.id} | Categoria atual: ${trans.category} | Descrição: ${trans.description}`,
        );
      });

      console.log('  🔧 Corrigindo...');
      const result2 = await prisma.$executeRaw`
        UPDATE transaction
        SET category = 'INVESTIMENTO', "updatedAt" = NOW()
        WHERE type = 'INVESTMENT' AND category != 'INVESTIMENTO' AND "deletedAt" IS NULL
      `;
      console.log(`  ✅ ${result2} registros corrigidos em Transaction\n`);
    } else {
      console.log('  ✅ Nenhum problema encontrado\n');
    }

    // 3. Verificar e corrigir INCOME com categoria incompatível
    console.log('📊 Verificando INCOME com categoria incompatível...');
    const invalidIncome = await prisma.$queryRaw<
      Array<{ id: string; type: string; category: string; description: string }>
    >`
      SELECT id, type, category, description
      FROM recurring_transaction
      WHERE type = 'INCOME'
        AND category NOT IN ('SALARIO', 'FREELANCE', 'PRESENTE', 'OUTROS')
        AND "deletedAt" IS NULL
    `;

    if (invalidIncome.length > 0) {
      console.log(`  ⚠️  Encontradas ${invalidIncome.length} receitas inválidas`);
      console.log('  🔧 Corrigindo para categoria OUTROS...');

      const result3 = await prisma.$executeRaw`
        UPDATE recurring_transaction
        SET category = 'OUTROS', "updatedAt" = NOW()
        WHERE type = 'INCOME'
          AND category NOT IN ('SALARIO', 'FREELANCE', 'PRESENTE', 'OUTROS')
          AND "deletedAt" IS NULL
      `;

      const result4 = await prisma.$executeRaw`
        UPDATE transaction
        SET category = 'OUTROS', "updatedAt" = NOW()
        WHERE type = 'INCOME'
          AND category NOT IN ('SALARIO', 'FREELANCE', 'PRESENTE', 'OUTROS')
          AND "deletedAt" IS NULL
      `;

      console.log(`  ✅ ${result3 + result4} registros corrigidos\n`);
    } else {
      console.log('  ✅ Nenhum problema encontrado\n');
    }

    // 4. Verificar e corrigir EXPENSE com categoria incompatível
    console.log('📊 Verificando EXPENSE com categoria incompatível...');
    const invalidExpense = await prisma.$queryRaw<
      Array<{ id: string; type: string; category: string; description: string }>
    >`
      SELECT id, type, category, description
      FROM recurring_transaction
      WHERE type = 'EXPENSE'
        AND category NOT IN ('ALIMENTACAO', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO', 'MORADIA', 'VESTUARIO', 'OUTROS')
        AND "deletedAt" IS NULL
    `;

    if (invalidExpense.length > 0) {
      console.log(`  ⚠️  Encontradas ${invalidExpense.length} despesas inválidas`);
      console.log('  🔧 Corrigindo para categoria OUTROS...');

      const result5 = await prisma.$executeRaw`
        UPDATE recurring_transaction
        SET category = 'OUTROS', "updatedAt" = NOW()
        WHERE type = 'EXPENSE'
          AND category NOT IN ('ALIMENTACAO', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO', 'MORADIA', 'VESTUARIO', 'OUTROS')
          AND "deletedAt" IS NULL
      `;

      const result6 = await prisma.$executeRaw`
        UPDATE transaction
        SET category = 'OUTROS', "updatedAt" = NOW()
        WHERE type = 'EXPENSE'
          AND category NOT IN ('ALIMENTACAO', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO', 'MORADIA', 'VESTUARIO', 'OUTROS')
          AND "deletedAt" IS NULL
      `;

      console.log(`  ✅ ${result5 + result6} registros corrigidos\n`);
    } else {
      console.log('  ✅ Nenhum problema encontrado\n');
    }

    // 5. Verificação final
    console.log('🔍 Verificação final...');
    const finalCheck = await prisma.$queryRaw<
      Array<{ tabela: string; total: bigint }>
    >`
      SELECT 'RecurringTransaction' as tabela, COUNT(*) as total
      FROM recurring_transaction
      WHERE "deletedAt" IS NULL
        AND (
          (type = 'INVESTMENT' AND category != 'INVESTIMENTO')
          OR (type = 'INCOME' AND category NOT IN ('SALARIO', 'FREELANCE', 'PRESENTE', 'OUTROS'))
          OR (type = 'EXPENSE' AND category NOT IN ('ALIMENTACAO', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO', 'MORADIA', 'VESTUARIO', 'OUTROS'))
        )

      UNION ALL

      SELECT 'Transaction' as tabela, COUNT(*) as total
      FROM transaction
      WHERE "deletedAt" IS NULL
        AND (
          (type = 'INVESTMENT' AND category != 'INVESTIMENTO')
          OR (type = 'INCOME' AND category NOT IN ('SALARIO', 'FREELANCE', 'PRESENTE', 'OUTROS'))
          OR (type = 'EXPENSE' AND category NOT IN ('ALIMENTACAO', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO', 'MORADIA', 'VESTUARIO', 'OUTROS'))
        )
    `;

    console.log('\n📋 Resultado final:');
    finalCheck.forEach((item) => {
      const total = Number(item.total);
      if (total > 0) {
        console.log(`  ❌ ${item.tabela}: ${total} registros ainda inválidos`);
      } else {
        console.log(`  ✅ ${item.tabela}: Tudo OK!`);
      }
    });

    console.log('\n✨ Correção concluída com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro ao corrigir dados:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
fixInvalidData();
