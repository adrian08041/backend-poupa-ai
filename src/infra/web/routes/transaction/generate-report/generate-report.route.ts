import { Controller, Get, Query, Request } from '@nestjs/common';
import { GenerateReportUsecase } from 'src/usecases/transaction/generate-report/generate-report.usecase';
import {
  generateReportQuerySchema,
  GenerateReportQueryDto,
} from './generate-report.dto';
import { GenerateReportPresenter } from './generate-report.presenter';

@Controller('transactions')
export class GenerateReportRoute {
  constructor(private readonly generateReportUsecase: GenerateReportUsecase) {}

  @Get('report')
  async handle(@Request() request, @Query() query: any) {
    console.log('📊 Requisição de relatório recebida:', query);

    // Validar query params
    const validatedQuery: GenerateReportQueryDto =
      generateReportQuerySchema.parse(query);

    // Extrair userId do token JWT
    const userId = request['userId'];

    // Se não foram fornecidos month/year, usa o mês atual
    const now = new Date();
    const month = validatedQuery.month || now.getMonth() + 1;
    const year = validatedQuery.year || now.getFullYear();
    const includeComparison = validatedQuery.includeComparison ?? true;

    console.log(
      `📅 Gerando relatório: ${month}/${year} - Comparação: ${includeComparison}`,
    );

    // Executar use case
    const output = await this.generateReportUsecase.execute({
      userId,
      month,
      year,
      includeComparison,
    });

    // Formatar resposta
    return GenerateReportPresenter.toHttp(output);
  }
}
