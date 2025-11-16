import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - aceita frontend local e em produção
  const allowedOrigins = [
    'http://localhost:3000',
    'https://frontend-poupa-ai.vercel.app',
    process.env.FRONTEND_URL, // URL customizada (opcional)
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Prefixo padrão das rotas
  app.setGlobalPrefix('api');

  // 🔧 Altere a porta do backend para 3001
  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 Backend rodando em: http://localhost:${port}/api`);
}
bootstrap();
