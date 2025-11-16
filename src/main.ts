import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  console.log('🔐 CORS: Origens permitidas:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      // Permite requisições sem 'origin' (Postman, apps mobile, etc.)
      if (!origin) {
        console.log('✅ CORS: Permitindo requisição sem origin');
        return callback(null, true);
      }

      console.log(`🔍 CORS: Verificando origem: ${origin}`);

      // Permite qualquer subdomínio de vercel.app (deploy previews)
      if (origin.endsWith('.vercel.app')) {
        console.log(`✅ CORS: Permitindo origem Vercel: ${origin}`);
        return callback(null, true);
      }

      // Verifica se a origem está na lista de permitidas
      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS: Origem permitida: ${origin}`);
        return callback(null, true);
      }

      // Origem não permitida
      console.log(`❌ CORS: Origem bloqueada: ${origin}`);
      console.log(`📋 Origens configuradas: ${allowedOrigins.join(', ')}`);
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

  // A porta é fornecida pela Railway via variável de ambiente PORT
  const port = process.env.PORT || 3001;

  // Em ambientes de container (Railway, Docker), é essencial usar '0.0.0.0'
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend rodando em: http://localhost:${port}/api`);
  console.log(`🔗 Escutando na porta ${port} em 0.0.0.0`);
  console.log(
    `💚 Health check disponível em: http://localhost:${port}/api/health`,
  );
}
bootstrap();
