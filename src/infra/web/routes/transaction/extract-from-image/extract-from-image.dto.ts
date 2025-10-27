/**
 * Response da rota de extração de transação de imagem
 */
export interface ExtractFromImageRouteResponse {
  description: string;
  amount: number; // Em reais
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category?: string;
  date?: string;
  confidence: number;
  extractedText?: string; // Opcional, para debug
}
