import { Injectable } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { OcrService } from '../ocr.service';

/**
 * Implementação do serviço de OCR usando Google Cloud Vision API
 */
@Injectable()
export class GoogleVisionOcrService extends OcrService {
  private readonly client: ImageAnnotatorClient;

  constructor() {
    super();
    // Inicializa o cliente do Google Vision
    // As credenciais são carregadas automaticamente da variável de ambiente
    // GOOGLE_APPLICATION_CREDENTIALS
    this.client = new ImageAnnotatorClient();
  }

  /**
   * Extrai texto de uma imagem usando Google Cloud Vision API
   * @param imageBuffer - Buffer da imagem a ser processada
   * @returns Texto extraído da imagem
   */
  async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    try {
      console.log('🔍 Iniciando extração de texto com Google Vision API...');

      // Faz a requisição para a API do Google Vision
      const [result] = await this.client.textDetection({
        image: { content: imageBuffer },
      });

      // Obtém as anotações de texto da resposta
      const detections = result.textAnnotations;

      if (!detections || detections.length === 0) {
        console.warn('⚠️ Nenhum texto detectado na imagem');
        return '';
      }

      // A primeira anotação contém todo o texto detectado
      const fullText = detections[0]?.description || '';

      console.log('✅ Texto extraído com sucesso');
      console.log('📝 Preview do texto:', fullText.substring(0, 200) + '...');

      return fullText;
    } catch (error) {
      console.error('❌ Erro ao extrair texto da imagem:', error);
      throw new Error(`Falha ao processar imagem com Google Vision: ${error.message}`);
    }
  }
}
