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
      // Aceita requisições sem origin (ex: Postman, curl, ferramentas internas)
      if (!origin) {
        console.log('✅ CORS: Permitindo requisição sem origin');
        return callback(null, true);
      }

      console.log(`🔍 CORS: Verificando origem: ${origin}`);

      // Lista de origens explicitamente permitidas
      const allowedOrigins = [
        'http://localhost:3000',
        'https://frontend-poupa-ai.vercel.app',
        process.env.FRONTEND_URL,
      ].filter((o) => o !== undefined && o !== null && o !== '');

      // Aceita qualquer domínio vercel.app (preview deployments)
      if (origin.endsWith('.vercel.app')) {
        console.log(`✅ CORS: Permitindo origem Vercel: ${origin}`);
        return callback(null, true);
      }

      // Verifica lista de origens permitidas
      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS: Origem permitida: ${origin}`);
        return callback(null, true);
      }

      // IMPORTANTE: Mesmo bloqueando, retorna true para permitir headers CORS
      // O navegador decide se aceita baseado nos headers retornados
      console.log(`⚠️  CORS: Origem não permitida, mas enviando headers: ${origin}`);
      console.log(`📋 Origens configuradas: ${allowedOrigins.join(', ')}`);

      // MUDANÇA CRÍTICA: Retorna false em vez de Error para permitir headers CORS
      return callback(null, false);
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
