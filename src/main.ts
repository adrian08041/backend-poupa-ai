import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - aceita frontend local e em produção
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'https://frontend-poupa-ai.vercel.app',
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      // Aceita requisições sem origin (ex: Postman, curl)
      if (!origin) {
        return callback(null, true);
      }

      // Aceita qualquer domínio vercel.app (preview deployments)
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // Verifica lista de origens permitidas
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`⚠️  CORS bloqueou origem: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // Cache preflight por 24h
  });

  // Prefixo padrão das rotas
  app.setGlobalPrefix('api');

  // 🔧 Altere a porta do backend para 3001
  const port = process.env.PORT ?? 3001;

  // Em produção (containers), precisa fazer bind em 0.0.0.0
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend rodando em: http://localhost:${port}/api`);
}
bootstrap();
