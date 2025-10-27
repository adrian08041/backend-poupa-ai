import { Provider } from '@nestjs/common';
import { AiParserService } from '../ai-parser.service';
import { OpenAiParserService } from './openai-parser.service';

/**
 * Provider para injeção de dependência do serviço de AI Parser
 * Registra a implementação do OpenAI como o serviço de parser padrão
 */
export const OpenAiParserServiceProvider: Provider = {
  provide: AiParserService,
  useClass: OpenAiParserService,
};
