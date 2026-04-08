import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fromBuffer } from 'file-type';
import { ExtractTransactionFromImageUseCase } from 'src/usecases/transaction/extract-from-image/extract-transaction-from-image.usecase';
import { ExtractFromImageRouteResponse } from './extract-from-image.dto';
import { ExtractFromImagePresenter } from './extract-from-image.presenter';

const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]);

@Controller('transactions')
export class ExtractFromImageRoute {
  constructor(
    private readonly extractTransactionFromImageUsecase: ExtractTransactionFromImageUseCase,
  ) {}

  @Post('extract-from-image')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async handle(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ExtractFromImageRouteResponse> {
    if (!file) {
      throw new BadRequestException(
        'Nenhuma imagem foi enviada. Envie um arquivo no campo "image".',
      );
    }

    const detectedType = await fromBuffer(file.buffer);

    if (!detectedType || !ALLOWED_MIMES.has(detectedType.mime)) {
      throw new BadRequestException(
        'Formato de arquivo inválido. Envie uma imagem (JPG, PNG, GIF, WEBP) ou PDF.',
      );
    }

    try {
      const result = await this.extractTransactionFromImageUsecase.execute({
        imageBuffer: file.buffer,
      });

      return ExtractFromImagePresenter.toHttp(result);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erro ao processar imagem',
      );
    }
  }
}
