import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  AiParserService,
  ExtractedTransactionData,
} from '../ai-parser.service';

/**
 * Implementação do serviço de parsing usando OpenAI GPT
 */
@Injectable()
export class OpenAiParserService extends AiParserService {
  private readonly openai: OpenAI;

  constructor() {
    super();
    // Inicializa o cliente OpenAI com a chave da variável de ambiente
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Extrai dados estruturados de transação a partir de texto usando OpenAI GPT
   * @param text - Texto extraído do OCR
   * @returns Dados estruturados da transação
   */
  async parseTransactionFromText(
    text: string,
  ): Promise<ExtractedTransactionData> {
    try {
      console.log('🤖 Iniciando parsing com OpenAI GPT...');

      const prompt = this.buildPrompt(text);

      // Faz a chamada para a API da OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Modelo mais barato, mas você pode usar gpt-4 para mais precisão
        messages: [
          {
            role: 'system',
            content:
              'Você é um assistente especializado em extrair informações de extratos bancários e comprovantes de transações financeiras. Sempre retorne APENAS um JSON válido, sem texto adicional.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Baixa temperatura para respostas mais consistentes
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Resposta vazia da OpenAI');
      }

      console.log('📝 Resposta da OpenAI:', content);

      // Parse do JSON retornado
      const parsed = JSON.parse(content);

      // Validação básica da resposta
      if (!parsed.description || !parsed.amount || !parsed.type) {
        throw new Error('Resposta da IA não contém todos os campos obrigatórios');
      }

      // Normaliza o tipo para garantir que é válido
      const normalizedType = this.normalizeType(parsed.type);

      const result: ExtractedTransactionData = {
        description: parsed.description,
        amount: parseFloat(parsed.amount),
        type: normalizedType,
        category: parsed.category || undefined,
        date: parsed.date || undefined,
        confidence: parsed.confidence || 50,
      };

      console.log('✅ Dados extraídos com sucesso:', result);

      return result;
    } catch (error) {
      console.error('❌ Erro ao fazer parsing com OpenAI:', error);
      throw new Error(`Falha ao processar texto com OpenAI: ${error.message}`);
    }
  }

  /**
   * Constrói o prompt para a OpenAI
   */
  private buildPrompt(text: string): string {
    return `
Analise o seguinte texto extraído de um extrato bancário ou comprovante de transação e extraia as informações:

Texto:
"""
${text}
"""

Retorne APENAS um JSON válido com a seguinte estrutura (sem markdown, sem explicações, apenas o JSON):
{
  "description": "descrição da transação",
  "amount": 150.50,
  "type": "EXPENSE",
  "category": "ALIMENTACAO",
  "date": "2025-10-25",
  "confidence": 95
}

Regras importantes:
1. type DEVE ser exatamente: "INCOME", "EXPENSE" ou "INVESTMENT"
   - Use "INCOME" para receitas, salários, depósitos recebidos
   - Use "EXPENSE" para gastos, pagamentos, débitos
   - Use "INVESTMENT" para investimentos, aplicações

2. category deve ser uma dessas opções (em MAIÚSCULAS):
   Para EXPENSE: ALIMENTACAO, TRANSPORTE, LAZER, SAUDE, EDUCACAO, MORADIA, VESTUARIO, OUTROS
   Para INCOME: SALARIO, FREELANCE, PRESENTE, OUTROS
   Para INVESTMENT: INVESTIMENTO, OUTROS

3. amount sempre como número positivo (ex: 150.50, não "R$ 150,50")

4. date no formato YYYY-MM-DD (se não encontrar data, não inclua o campo)

5. confidence de 0 a 100 (baseado na clareza das informações)

6. description deve ser clara e concisa (ex: "Pagamento de conta de luz", "Salário mensal")

Retorne APENAS o JSON, sem formatação markdown ou texto adicional.
    `.trim();
  }

  /**
   * Normaliza o tipo da transação
   */
  private normalizeType(
    type: string,
  ): 'INCOME' | 'EXPENSE' | 'INVESTMENT' {
    const normalized = type.toUpperCase();

    if (normalized === 'INCOME' || normalized === 'RECEITA') {
      return 'INCOME';
    }
    if (normalized === 'EXPENSE' || normalized === 'DESPESA') {
      return 'EXPENSE';
    }
    if (normalized === 'INVESTMENT' || normalized === 'INVESTIMENTO') {
      return 'INVESTMENT';
    }

    // Default para EXPENSE se não reconhecer
    return 'EXPENSE';
  }
}
