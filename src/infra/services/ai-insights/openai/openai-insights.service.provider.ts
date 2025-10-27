import { Provider } from '@nestjs/common';
import { AiInsightsService } from '../ai-insights.service';
import { OpenAIInsightsService } from './openai-insights.service';

export const OpenAIInsightsServiceProvider: Provider = {
  provide: AiInsightsService,
  useClass: OpenAIInsightsService,
};
