import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'], // FRONTEND (
    credentials: true,
  });

  // Prefixo padrão das rotas
  app.setGlobalPrefix('api');

  // 🔧 Altere a porta do backend para 3001
  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 Backend rodando em: http://localhost:${port}/api`);
}
bootstrap();
