import { Module } from '@nestjs/common';
import { GoogleVisionOcrServiceProvider } from '../ocr/google-vision/google-vision-ocr.service.provider';
import { OpenAiParserServiceProvider } from '../ai-parser/openai/openai-parser.service.provider';

/**
 * Módulo de serviços de extração
 * Agrupa os serviços de OCR e AI Parser
 */
@Module({
  providers: [GoogleVisionOcrServiceProvider, OpenAiParserServiceProvider],
  exports: [GoogleVisionOcrServiceProvider, OpenAiParserServiceProvider],
})
export class ExtractionServiceModule {}
