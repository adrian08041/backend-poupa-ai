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
    // Suporta duas formas de configuração:
    // 1. GOOGLE_CREDENTIALS_JSON - JSON completo (para produção/Railway)
    // 2. GOOGLE_APPLICATION_CREDENTIALS - caminho do arquivo (para desenvolvimento local)

    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;

    if (credentialsJson) {
      console.log('🔑 Usando credenciais do Google Cloud via GOOGLE_CREDENTIALS_JSON');
      try {
        const credentials = JSON.parse(credentialsJson);
        this.client = new ImageAnnotatorClient({
          credentials,
        });
      } catch (error) {
        console.error('❌ Erro ao fazer parse das credenciais JSON:', error);
        throw new Error('GOOGLE_CREDENTIALS_JSON contém JSON inválido');
      }
    } else {
      console.log('🔑 Usando credenciais do Google Cloud via GOOGLE_APPLICATION_CREDENTIALS');
      // Fallback para o método padrão (arquivo)
      this.client = new ImageAnnotatorClient();
    }
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
