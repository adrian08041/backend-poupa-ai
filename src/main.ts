import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

function validateEnv() {
  const required = [
    'DATABASE_URL',
    'JWT_AUTH_SECRET',
    'JWT_REFRESH_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias não definidas: ${missing.join(', ')}`,
    );
  }

  if (process.env.JWT_AUTH_SECRET && process.env.JWT_AUTH_SECRET.length < 32) {
    throw new Error('JWT_AUTH_SECRET deve ter pelo menos 32 caracteres');
  }

  if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 32) {
    throw new Error('JWT_REFRESH_SECRET deve ter pelo menos 32 caracteres');
  }
}

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(helmet({ contentSecurityPolicy: false }));

  // ========================================
  // CONFIGURAÇÃO DE CORS CORRIGIDA
  // ========================================

  // Lista de origens permitidas
  const allowedOrigins = [
    'http://localhost:3000',
    'https://frontend-poupa-ai.vercel.app',
  ];

  // Adiciona a URL do ambiente se ela existir
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }


  app.enableCors({
    origin: (origin, callback) => {
      // Permite requisições sem 'origin' (Postman, apps mobile, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (/^https:\/\/frontend-poupa-ai[\w-]*\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      // Verifica se a origem está na lista de permitidas
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Origem não permitida
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Prefixo padrão das rotas
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend rodando em: http://localhost:${port}/api`);
  console.log(`🔗 Escutando na porta ${port} em 0.0.0.0`);
  console.log(
    `💚 Health check disponível em: http://localhost:${port}/api/health`,
  );
}
bootstrap();
