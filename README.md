# 💰 PoupaAI - Backend

API RESTful para gerenciamento financeiro pessoal construída com **Clean Architecture** e **Domain-Driven Design**.

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Rodando o Projeto](#-rodando-o-projeto)
- [API Endpoints](#-api-endpoints)
- [Testes](#-testes)
- [Estrutura de Pastas](#-estrutura-de-pastas)

## 🎯 Sobre o Projeto

PoupaAI é uma plataforma de gestão financeira pessoal que permite aos usuários:

- 🔐 Autenticação segura com JWT (dual-token: auth + refresh)
- 💸 Gerenciamento de transações (receitas e despesas)
- 📊 Categorização automática de gastos
- 💳 Suporte para múltiplos métodos de pagamento (PIX, Boleto, Cartão, etc.)
- 🗂️ Soft delete para histórico de transações

## 🚀 Tecnologias

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript com tipagem estática
- **[Prisma](https://www.prisma.io/)** - ORM moderno para Node.js
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript-first
- **[JWT](https://jwt.io/)** - JSON Web Tokens para autenticação
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Hash de senhas
- **[Jest](https://jestjs.io/)** - Framework de testes

## 🏗️ Arquitetura

Este projeto segue os princípios de **Clean Architecture** e **DDD**:

```
src/
├── domain/           # Regras de negócio puras
│   ├── entities/     # Entidades de domínio (User, Transaction)
│   ├── validators/   # Validadores Zod
│   ├── repositories/ # Interfaces de repositórios (Gateways)
│   └── factories/    # Factories para validadores
├── usecases/         # Casos de uso (lógica de aplicação)
│   ├── user/         # Casos de uso de usuários
│   └── transaction/  # Casos de uso de transações
├── infra/            # Camada de infraestrutura
│   ├── repositories/ # Implementações Prisma dos repositórios
│   ├── services/     # Serviços (JWT, Prisma)
│   └── web/          # Controllers, rotas, guards, filters
└── shared/           # Utilitários compartilhados
```

### Princípios Chave:

- **Entities**: Criadas via factories estáticos (`User.create()`, `User.with()`)
- **Validation**: Validação Zod obrigatória na criação de entidades
- **Exceptions**: Sistema de 3 camadas (Domain, Usecase, Service)
- **Repository Pattern**: Gateways abstratos + implementações Prisma
- **Dependency Injection**: Provider pattern do NestJS

## ✅ Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Docker** e **Docker Compose** (para PostgreSQL)
- **Git**

## 📦 Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/adrian08041/backend-poupa-ai.git
cd backend-poupa-ai
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:1234@localhost:5432/postgres?schema=public"
JWT_SECRET="seu-secret-super-seguro-aqui"
JWT_REFRESH_SECRET="seu-refresh-secret-super-seguro-aqui"
PORT=3001
```

4. **Suba o banco de dados PostgreSQL**

```bash
docker compose up -d
```

5. **Execute as migrações do Prisma**

```bash
npx prisma generate
npx prisma migrate dev
```

## 🎮 Rodando o Projeto

### Modo Desenvolvimento

npm run start:dev

````

Servidor rodando em: `http://localhost:3001/api`

### Modo Produção

```bash
npm run build
npm run start:prod
````

### Outros Comandos Úteis

```bash
# Formatação de código
npm run format

# Lint
npm run lint

# Prisma Studio (interface visual do banco)
npx prisma studio
```

## 🔌 API Endpoints

Base URL: `http://localhost:3001/api`

### 👤 Autenticação & Usuários

| Método | Endpoint         | Descrição          | Autenticado |
| ------ | ---------------- | ------------------ | ----------- |
| `POST` | `/users`         | Criar novo usuário | ❌          |
| `POST` | `/users/login`   | Login              | ❌          |
| `POST` | `/users/refresh` | Renovar token      | ❌          |
| `POST` | `/users/logout`  | Logout             | ✅          |
| `GET`  | `/users/me`      | Dados do usuário   | ✅          |

### 💸 Transações

| Método | Endpoint        | Descrição       | Autenticado |
| ------ | --------------- | --------------- | ----------- |
| `POST` | `/transactions` | Criar transação | ✅          |

### Exemplos de Requisições

**Criar Usuário**

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

**Login**

```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

**Criar Transação**

```bash
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "type": "EXPENSE",
    "category": "ALIMENTACAO",
    "paymentMethod": "PIX",
    "amount": 25.50,
    "description": "Almoço",
    "date": "2025-10-16T12:00:00Z"
  }'
```

> 📖 **Documentação completa**: Consulte o arquivo [`api_rest_routes.md`](./api_rest_routes.md) para mais detalhes.

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes em modo watch
npm run test:watch

# Testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

### Padrão de Testes

Este projeto utiliza o padrão **Arrange-Act-Assert (AAA)**:

```typescript
it('should create a user when passing valid email and password', () => {
  // Arrange
  const anEmail = 'john@doe.com';
  const aPassword = '12345678';

  // Act
  const anUser = User.create({ email: anEmail, password: aPassword });

  // Assert
  expect(anUser).toBeInstanceOf(User);
  expect(anUser.getEmail()).toBe(anEmail);
});
```

## 📁 Estrutura de Pastas

```
backend/
├── .github/
│   └── copilot-instructions.md  # Instruções para AI coding agents
├── generated/
│   └── prisma/                  # Cliente Prisma gerado
├── prisma/
│   ├── schema.prisma            # Schema do banco de dados
│   └── migrations/              # Migrações
├── src/
│   ├── domain/                  # Camada de domínio (entidades, validadores)
│   ├── usecases/                # Casos de uso
│   ├── infra/                   # Infraestrutura (repositories, web, services)
│   ├── shared/                  # Utilitários compartilhados
│   └── main.ts                  # Entry point da aplicação
├── test/                        # Testes E2E
├── compose.yaml                 # Docker Compose (PostgreSQL)
└── package.json
```

## 🔒 Segurança

- ✅ Senhas hasheadas com **bcryptjs**
- ✅ Autenticação JWT com **dual-token** (auth + refresh)
- ✅ **AuthGuard** global (requer autenticação por padrão)
- ✅ Validação de dados com **Zod**
- ✅ Exception filters personalizados
- ✅ CORS habilitado para frontend

## 💾 Modelo de Dados

### Valores Monetários

Todos os valores são armazenados em **centavos**:

```typescript
1050; // = R$ 10,50
2500; // = R$ 25,00
```

### Métodos de Pagamento

- `PIX`
- `BOLETO`
- `CARTAO`
- `TRANSFERENCIA`
- `DINHEIRO`

### Categorias de Transação

**Despesas**: `ALIMENTACAO`, `TRANSPORTE`, `LAZER`, `SAUDE`, `EDUCACAO`, `MORADIA`, `VESTUARIO`  
**Receitas**: `SALARIO`, `FREELANCE`, `INVESTIMENTO`, `PRESENTE`  
**Genérico**: `OUTROS`

## 🛠️ Troubleshooting

### Erro de conexão com PostgreSQL

```bash
# Verifique se o container está rodando
docker ps

# Reinicie o container
docker compose restart
```

### Prisma Client não encontrado

```bash
# Regenere o cliente Prisma
npx prisma generate
```

### Porta 3001 já em uso

```bash
# Altere a porta no arquivo .env
PORT=3002
```

## 📚 Recursos Adicionais

- [Documentação NestJS](https://docs.nestjs.com)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ usando NestJS e Clean Architecture**

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
