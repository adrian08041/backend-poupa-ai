import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  AiInsightsService,
  ReportData,
  AIInsights,
} from '../ai-insights.service';

/**
 * Implementação do serviço de insights usando OpenAI GPT
 */
@Injectable()
export class OpenAIInsightsService extends AiInsightsService {
  private readonly openai: OpenAI;

  constructor() {
    super();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY não configurada no .env');
    }

    this.openai = new OpenAI({ apiKey });
  }

  async generateInsights(reportData: ReportData): Promise<AIInsights> {
    try {
      const prompt = this.buildPrompt(reportData);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Você é um assistente financeiro pessoal especializado em análise de gastos e planejamento financeiro. Retorne SEMPRE respostas em JSON válido, sem markdown.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Resposta vazia da OpenAI');
      }

      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      return JSON.parse(cleanedContent) as AIInsights;
    } catch {
      return this.getFallbackInsights(reportData);
    }
  }

  private buildPrompt(data: ReportData): string {
    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    const categoryBreakdown = data.categoryBreakdown
      .map(
        (cat) =>
          `- ${cat.category}: R$ ${cat.amount.toFixed(2)} (${cat.percentage.toFixed(1)}% do total)`,
      )
      .join('\n');

    const paymentMethodBreakdown = data.paymentMethodBreakdown
      .map(
        (pm) =>
          `- ${pm.method}: R$ ${pm.amount.toFixed(2)} (${pm.transactionCount} transações)`,
      )
      .join('\n');

    const topExpenses = data.topExpenses
      .map(
        (exp, idx) =>
          `${idx + 1}. ${exp.description} - R$ ${exp.amount.toFixed(2)} - ${exp.date} - ${exp.category}`,
      )
      .join('\n');

    let comparisonSection = '';
    if (data.comparisonData) {
      const comp = data.comparisonData;
      comparisonSection = `
## COMPARAÇÃO COM MÊS ANTERIOR
Período Anterior: ${monthNames[comp.previousMonth - 1]}/${comp.previousYear}
Receitas: R$ ${comp.income.toFixed(2)} (diferença: ${comp.incomePercentage >= 0 ? '+' : ''}${comp.incomePercentage.toFixed(1)}% / R$ ${comp.incomeDifference.toFixed(2)})
Despesas: R$ ${comp.expenses.toFixed(2)} (diferença: ${comp.expensesPercentage >= 0 ? '+' : ''}${comp.expensesPercentage.toFixed(1)}% / R$ ${comp.expensesDifference.toFixed(2)})
Investimentos: R$ ${comp.investments.toFixed(2)} (diferença: ${comp.investmentsPercentage >= 0 ? '+' : ''}${comp.investmentsPercentage.toFixed(1)}% / R$ ${comp.investmentsDifference.toFixed(2)})
Saldo: R$ ${comp.balance.toFixed(2)} (diferença: ${comp.balancePercentage >= 0 ? '+' : ''}${comp.balancePercentage.toFixed(1)}% / R$ ${comp.balanceDifference.toFixed(2)})
`;
    }

    let categoryComparisonSection = '';
    if (data.categoryComparison && data.categoryComparison.length > 0) {
      categoryComparisonSection = `
## VARIAÇÃO POR CATEGORIA (vs. mês anterior)
${data.categoryComparison
  .map(
    (cat) =>
      `- ${cat.category}: ${cat.percentage >= 0 ? '+' : ''}${cat.percentage.toFixed(1)}% (R$ ${cat.difference.toFixed(2)} de diferença)`,
  )
  .join('\n')}
`;
    }

    return `Você é um assistente financeiro pessoal especializado em análise de gastos e planejamento financeiro. Sua função é analisar os dados financeiros do usuário e gerar insights práticos, personalizados e motivacionais que ajudem a melhorar a saúde financeira.

Seja sempre empático e encorajador (nunca crítico), prático e objetivo (dicas acionáveis), claro e direto (linguagem simples), e personalizado (use os dados específicos do usuário).

---

# DADOS FINANCEIROS DO USUÁRIO

## PERÍODO ATUAL
- Mês/Ano: ${monthNames[data.month - 1]}/${data.year}
- Total de Receitas: R$ ${data.totalIncome.toFixed(2)}
- Total de Despesas: R$ ${data.totalExpenses.toFixed(2)}
- Total de Investimentos: R$ ${data.totalInvestments.toFixed(2)}
- Saldo Final: R$ ${data.balance.toFixed(2)}
- Taxa de Poupança: ${data.savingsRate.toFixed(1)}%

## DISTRIBUIÇÃO POR CATEGORIA
${categoryBreakdown}

## DISTRIBUIÇÃO POR MÉTODO DE PAGAMENTO
${paymentMethodBreakdown}

## MAIORES DESPESAS INDIVIDUAIS (Top 5)
${topExpenses}

## ESTATÍSTICAS
- Total de transações: ${data.transactionCount}
- Média de gasto por dia: R$ ${data.averagePerDay.toFixed(2)}
- Dia com maior gasto: ${data.maxExpenseDay} (R$ ${data.maxExpenseAmount.toFixed(2)})
- Dias sem gastos: ${data.daysWithoutExpenses}
${comparisonSection}${categoryComparisonSection}
## CONTEXTO
- Primeiro relatório: ${data.isFirstReport ? 'Sim' : 'Não'}
- Tendência geral: ${data.trend === 'increasing' ? 'Aumentando' : data.trend === 'decreasing' ? 'Diminuindo' : 'Estável'}
- Tem investimentos regulares: ${data.hasRegularInvestments ? 'Sim' : 'Não'}

---

# ANÁLISE SOLICITADA

Gere uma análise completa com:

1. **Visão Geral**: Resumo do mês em 2-3 frases motivacionais
2. **Pontos Positivos**: 2-4 comportamentos financeiros saudáveis identificados
3. **Pontos de Atenção**: 2-4 padrões que merecem atenção (com empatia)
4. **Análise por Categoria**: Top 3 categorias com maior gasto
5. **Dicas Personalizadas**: 4-6 recomendações práticas e acionáveis
6. **Metas para Próximo Mês**: 1-2 metas específicas e mensuráveis
7. **Comparação Inteligente**: Análise da evolução vs. mês anterior
8. **Curiosidade**: Um insight único e interessante
9. **Score de Saúde Financeira**: Nota de 0-100 com justificativa

---

# FORMATO DE RESPOSTA

Retorne APENAS um JSON válido (sem markdown, sem \`\`\`json) com a seguinte estrutura:

{
  "visaoGeral": "string",
  "pontosPositivos": ["string"],
  "pontosAtencao": ["string"],
  "analiseCategoria": [
    {
      "categoria": "string",
      "gasto": number,
      "percentual": number,
      "analise": "string",
      "oportunidade": "string"
    }
  ],
  "dicasPersonalizadas": [
    {
      "titulo": "string",
      "descricao": "string",
      "impacto": "string",
      "prioridade": "alta|media|baixa"
    }
  ],
  "metasProximoMes": [
    {
      "tipo": "economia|investimento|reducao",
      "descricao": "string",
      "valorAlvo": number,
      "categoria": "string"
    }
  ],
  "comparacao": {
    "resumo": "string",
    "melhorias": ["string"],
    "retrocessos": ["string"],
    "tendencia": "positiva|negativa|estavel"
  },
  "curiosidade": "string",
  "score": {
    "saudabilidadeFinanceira": number,
    "justificativa": "string"
  }
}

---

# REGRAS

- Use valores em R$ formatados corretamente
- Tom positivo e encorajador sempre
- Cite números específicos dos dados fornecidos
- Sem jargões financeiros complexos
- Dê exemplos práticos nas dicas
- Parabenize melhorias explicitamente
- Qualidade > quantidade nos insights
- Máximo 6-8 insights por seção`;
  }

  private getFallbackInsights(data: ReportData): AIInsights {
    const isPositiveBalance = data.balance >= 0;

    return {
      visaoGeral: isPositiveBalance
        ? `Você teve um saldo positivo de R$ ${data.balance.toFixed(2)} neste mês! Continue assim.`
        : `Seu saldo ficou negativo em R$ ${Math.abs(data.balance).toFixed(2)}. Vamos trabalhar juntos para reverter isso.`,
      pontosPositivos: [
        data.savingsRate > 0
          ? `Taxa de poupança de ${data.savingsRate.toFixed(1)}%`
          : 'Você registrou suas transações, primeiro passo para controle financeiro!',
      ],
      pontosAtencao: [
        data.balance < 0
          ? 'Saldo negativo requer atenção imediata'
          : 'Continue monitorando seus gastos',
      ],
      analiseCategoria: data.categoryBreakdown.slice(0, 3).map((cat) => ({
        categoria: cat.category,
        gasto: cat.amount,
        percentual: cat.percentage,
        analise: `Você gastou R$ ${cat.amount.toFixed(2)} nesta categoria.`,
        oportunidade: 'Analise se é possível reduzir gastos aqui.',
      })),
      dicasPersonalizadas: [
        {
          titulo: 'Monitore seus gastos',
          descricao:
            'Continue registrando todas as transações para ter controle total.',
          impacto: 'Melhor visibilidade financeira',
          prioridade: 'alta',
        },
      ],
      metasProximoMes: [
        {
          tipo: 'economia',
          descricao: 'Buscar saldo positivo',
          valorAlvo: Math.abs(data.balance) + 100,
        },
      ],
      comparacao: {
        resumo: 'Dados insuficientes para comparação',
        melhorias: [],
        retrocessos: [],
        tendencia: 'estavel',
      },
      curiosidade: `Você teve ${data.transactionCount} transações neste mês.`,
      score: {
        saudabilidadeFinanceira: isPositiveBalance ? 60 : 40,
        justificativa: isPositiveBalance
          ? 'Saldo positivo é um bom começo'
          : 'Saldo negativo requer atenção',
      },
    };
  }
}
