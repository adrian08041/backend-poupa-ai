import { Provider } from '@nestjs/common';
import { OcrService } from '../ocr.service';
import { GoogleVisionOcrService } from './google-vision-ocr.service';

/**
 * Provider para injeção de dependência do serviço de OCR
 * Registra a implementação do Google Vision como o serviço de OCR padrão
 */
export const GoogleVisionOcrServiceProvider: Provider = {
  provide: OcrService,
  useClass: GoogleVisionOcrService,
};
