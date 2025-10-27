/**
 * Interface para dados de transação extraídos pela IA
 */
export interface ExtractedTransactionData {
  description: string;
  amount: number; // Valor em reais
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category?: string;
  date?: string; // Formato: YYYY-MM-DD
  confidence: number; // 0-100
}

/**
 * Abstract AI Parser Service Interface
 * Define o contrato para serviços de parsing de texto usando IA
 */
export abstract class AiParserService {
  /**
   * Extrai dados estruturados de transação a partir de texto
   * @param text - Texto extraído da imagem (OCR)
   * @returns Dados estruturados da transação
   */
  abstract parseTransactionFromText(
    text: string,
  ): Promise<ExtractedTransactionData>;
}
