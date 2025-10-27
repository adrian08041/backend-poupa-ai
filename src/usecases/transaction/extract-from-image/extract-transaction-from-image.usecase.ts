import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/usecases/usecase';
import { OcrService } from 'src/infra/services/ocr/ocr.service';
import { AiParserService } from 'src/infra/services/ai-parser/ai-parser.service';

/**
 * Input para o caso de uso de extração de transação de imagem
 */
export interface ExtractTransactionFromImageInput {
  imageBuffer: Buffer;
}

/**
 * Output do caso de uso de extração de transação de imagem
 */
export interface ExtractTransactionFromImageOutput {
  description: string;
  amount: number; // Em reais
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category?: string;
  date?: string;
  confidence: number;
  extractedText: string; // Texto bruto extraído do OCR (para debug)
}

/**
 * Caso de uso: Extrair dados de transação a partir de imagem
 *
 * Fluxo:
 * 1. Recebe buffer da imagem
 * 2. Usa OCR (Google Vision) para extrair texto
 * 3. Usa IA (OpenAI GPT) para estruturar os dados
 * 4. Retorna dados estruturados da transação
 */
@Injectable()
export class ExtractTransactionFromImageUseCase
  implements
    UseCase<ExtractTransactionFromImageInput, ExtractTransactionFromImageOutput>
{
  constructor(
    private readonly ocrService: OcrService,
    private readonly aiParserService: AiParserService,
  ) {}

  async execute(
    input: ExtractTransactionFromImageInput,
  ): Promise<ExtractTransactionFromImageOutput> {
    console.log('🚀 Iniciando extração de transação de imagem...');

    try {
      // Passo 1: Extrair texto da imagem usando OCR
      console.log('📸 Passo 1: Extraindo texto da imagem...');
      const extractedText = await this.ocrService.extractTextFromImage(
        input.imageBuffer,
      );

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error(
          'Não foi possível extrair texto da imagem. Verifique se a imagem contém texto legível.',
        );
      }

      console.log(
        '✅ Texto extraído:',
        extractedText.substring(0, 200) + '...',
      );

      // Passo 2: Estruturar dados usando IA
      console.log('🤖 Passo 2: Estruturando dados com IA...');
      const parsedData =
        await this.aiParserService.parseTransactionFromText(extractedText);

      console.log('✅ Dados estruturados:', parsedData);

      // Passo 3: Retornar resultado
      const output: ExtractTransactionFromImageOutput = {
        description: parsedData.description,
        amount: parsedData.amount,
        type: parsedData.type,
        category: parsedData.category,
        date: parsedData.date,
        confidence: parsedData.confidence,
        extractedText: extractedText, // Incluído para debug/auditoria
      };

      console.log('🎉 Extração concluída com sucesso!');

      return output;
    } catch (error) {
      console.error('❌ Erro ao extrair transação de imagem:', error);
      throw error;
    }
  }
}
