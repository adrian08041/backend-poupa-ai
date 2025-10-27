/**
 * Abstract OCR Service Interface
 * Define o contrato para serviços de OCR (Optical Character Recognition)
 */
export abstract class OcrService {
  /**
   * Extrai texto de uma imagem
   * @param imageBuffer - Buffer da imagem
   * @returns Texto extraído da imagem
   */
  abstract extractTextFromImage(imageBuffer: Buffer): Promise<string>;
}
