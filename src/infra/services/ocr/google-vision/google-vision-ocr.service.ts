import { Injectable, Logger } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { OcrService } from '../ocr.service';

@Injectable()
export class GoogleVisionOcrService extends OcrService {
  private readonly client: ImageAnnotatorClient;
  private readonly logger = new Logger(GoogleVisionOcrService.name);

  constructor() {
    super();

    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;

    if (credentialsJson) {
      try {
        const credentials = JSON.parse(credentialsJson);
        this.client = new ImageAnnotatorClient({ credentials });
      } catch {
        throw new Error('GOOGLE_CREDENTIALS_JSON contém JSON inválido');
      }
    } else {
      this.client = new ImageAnnotatorClient();
    }
  }

  async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    const [result] = await this.client.textDetection({
      image: { content: imageBuffer },
    });

    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      this.logger.warn('Nenhum texto detectado na imagem');
      return '';
    }

    return detections[0]?.description || '';
  }
}
