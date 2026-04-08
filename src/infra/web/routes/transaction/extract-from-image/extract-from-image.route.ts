import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExtractTransactionFromImageUseCase } from 'src/usecases/transaction/extract-from-image/extract-transaction-from-image.usecase';
import { ExtractFromImageRouteResponse } from './extract-from-image.dto';
import { ExtractFromImagePresenter } from './extract-from-image.presenter';

/**
 * Rota para extração de transação a partir de imagem
 * POST /api/transactions/extract-from-image
 */
@Controller('transactions')
export class ExtractFromImageRoute {
  constructor(
    private readonly extractTransactionFromImageUsecase: ExtractTransactionFromImageUseCase,
  ) {}

  @Post('extract-from-image')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
        // Aceita apenas imagens e PDFs
        const allowedMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
        ];

        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Formato de arquivo inválido. Envie uma imagem (JPG, PNG, GIF, WEBP) ou PDF.',
            ),
            false,
          );
        }
      },
    }),
  )
  async handle(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ExtractFromImageRouteResponse> {
    // Validações
    if (!file) {
      throw new BadRequestException(
        'Nenhuma imagem foi enviada. Envie um arquivo no campo "image".',
      );
    }

    console.log('📤 Arquivo recebido:', {
      filename: file.originalname,
      mimetype: file.mimetype,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    });

    try {
      // Executa o caso de uso
      const result = await this.extractTransactionFromImageUsecase.execute({
        imageBuffer: file.buffer,
      });

      // Transforma o resultado em resposta HTTP
      const response = ExtractFromImagePresenter.toHttp(result);

      console.log('✅ Extração concluída com sucesso');

      return response;
    } catch (error) {
      console.error('❌ Erro na rota de extração:', error);
      throw new BadRequestException(
        error.message || 'Erro ao processar imagem',
      );
    }
  }
}
