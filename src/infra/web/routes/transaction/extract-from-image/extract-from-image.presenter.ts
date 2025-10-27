import { ExtractTransactionFromImageOutput } from 'src/usecases/transaction/extract-from-image/extract-transaction-from-image.usecase';
import { ExtractFromImageRouteResponse } from './extract-from-image.dto';

/**
 * Presenter para transformar o output do use case em resposta HTTP
 */
export class ExtractFromImagePresenter {
  static toHttp(
    output: ExtractTransactionFromImageOutput,
  ): ExtractFromImageRouteResponse {
    return {
      description: output.description,
      amount: output.amount,
      type: output.type,
      category: output.category,
      date: output.date,
      confidence: output.confidence,
      // Não incluir extractedText por padrão (pode ser muito grande)
      // extractedText: output.extractedText,
    };
  }
}
