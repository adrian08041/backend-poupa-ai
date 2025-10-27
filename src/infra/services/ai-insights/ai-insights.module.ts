import { Module } from '@nestjs/common';
import { OpenAIInsightsServiceProvider } from './openai/openai-insights.service.provider';

@Module({
  providers: [OpenAIInsightsServiceProvider],
  exports: [OpenAIInsightsServiceProvider],
})
export class AiInsightsModule {}
