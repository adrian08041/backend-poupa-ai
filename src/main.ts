import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Lista de origens permitidas
  const allowedOrigins = [
    'http://localhost:3000', // Sua aplicação frontend local
    'https://frontend-poupa-ai.vercel.app', // Seu frontend em produção
  ];

  // Adiciona a URL do ambiente se ela existir
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  // Configuração de CORS simplificada e correta
  app.enableCors({
    origin: (origin, callback) => {
      // Permite requisições sem 'origin' (como Postman, apps mobile, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Permite qualquer subdomínio de vercel.app (útil para deploy previews)
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // Verifica se a origem está na lista de permitidas
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Se a origem não for permitida, recusa a requisição
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Prefixo padrão das rotas
  app.setGlobalPrefix('api');

  // A porta para Railway é fornecida pela variável de ambiente PORT
  const port = process.env.PORT || 3001;

  // Em ambientes de container (como Railway e Docker), é essencial usar '0.0.0.0'
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend rodando em: http://localhost:${port}`);
  console.log(`🔗 Escutando na porta ${port} em 0.0.0.0`);
}
bootstrap();
