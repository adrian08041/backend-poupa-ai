# 🚀 PoupaAI Backend

> API RESTful para gerenciamento de finanças pessoais com inteligência artificial

## 📑 Sobre

Backend construído com **NestJS** seguindo **Clean Architecture** e princípios de **Domain-Driven Design**.

### O que você vai aprender estudando este código:
- ✅ Clean Architecture em prática
- ✅ NestJS avançado (Guards, Filters, Modules)
- ✅ Prisma ORM com PostgreSQL
- ✅ Autenticação JWT (dual token)
- ✅ Integração com IA (OpenAI GPT + Google Vision)
- ✅ Padrões de design (Repository, Factory, Use Case)
- ✅ SOLID Principles

---

## 🏗️ Arquitetura (Clean Architecture)

```
┌─────────────────────────────────────┐
│   CAMADA DE DOMÍNIO (Pura)          │
│   - Entidades de negócio             │
│   - Validadores                      │
│   - Interfaces de Repositórios       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   CAMADA DE CASOS DE USO            │
│   - Lógica de aplicação              │
│   - Orquestração de entidades        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   CAMADA DE INFRAESTRUTURA          │
│   - Repositories (Prisma)            │
│   - Services (JWT, OpenAI, Google)   │
│   - Controllers HTTP                 │
└─────────────────────────────────────┘
```

**Benefícios:**
- ✅ Testável (mocks fáceis)
- ✅ Manutenível (separação clara)
- ✅ Flexível (trocar frameworks)
- ✅ Escalável (adicionar features)

---

## 📂 Estrutura de Pastas

```
backend/
├── src/
│   ├── domain/              # 🔵 Camada de Domínio
│   │   ├── entities/        # Entidades de negócio
│   │   ├── validators/      # Validadores Zod
│   │   └── repositories/    # Interfaces (Gateways)
│   │
│   ├── usecases/            # 🟢 Camada de Casos de Uso
│   │   ├── user/
│   │   │   ├── create/
│   │   │   ├── login/
│   │   │   └── ...
│   │   └── transaction/
│   │       ├── create/
│   │       ├── list/
│   │       ├── extract-from-image/  # 🤖 OCR + IA
│   │       └── generate-report/     # 🤖 Relatórios IA
│   │
│   └── infra/               # 🟡 Camada de Infraestrutura
│       ├── repositories/    # Implementações Prisma
│       ├── services/        # JWT, OpenAI, Google
│       └── web/             # Controllers HTTP
│           ├── routes/
│           ├── filters/
│           └── guards/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
└── credentials/             # Google Cloud (não commitado)
```

---

## 🛠️ Tecnologias

| Tech | Versão | Uso |
|------|--------|-----|
| Node.js | 20.x | Runtime |
| NestJS | 10.x | Framework |
| TypeScript | 5.x | Linguagem |
| PostgreSQL | 14.x | Banco de dados |
| Prisma | 5.x | ORM |
| JWT | - | Autenticação |
| OpenAI | GPT-4o-mini | IA (relatórios/extração) |
| Google Vision | - | OCR (extração de imagem) |
| Zod | - | Validação |
| bcrypt | - | Hash de senhas |

---

## 🚀 Instalação e Execução

### 1. Pré-requisitos
- Node.js 20.x
- PostgreSQL 14.x
- npm 9.x

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar ambiente
```bash
# Copiar exemplo
cp .env.example .env

# Editar com suas credenciais
nano .env
```

**Variáveis necessárias:**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/poupaai"
JWT_AUTH_SECRET="sua-chave-secreta"
JWT_REFRESH_SECRET="outra-chave"
OPENAI_API_KEY="sk-proj-..."
GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
PORT=3001
```

### 4. Setup do banco
```bash
# Gerar Prisma Client
npx prisma generate

# Rodar migrações
npx prisma migrate dev
```

### 5. Executar
```bash
# Desenvolvimento (hot reload)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

Acesse: `http://localhost:3001/api`

---

## ✨ Funcionalidades

### 1. Autenticação JWT 🔐
- Dual token (access + refresh)
- Access token: 1 hora
- Refresh token: 7 dias

**Endpoints:**
- POST `/api/users` - Criar conta
- POST `/api/users/login` - Login
- POST `/api/users/refresh` - Renovar token
- POST `/api/users/logout` - Logout

### 2. Gerenciamento de Usuários 👤
- GET `/api/users/me` - Dados do usuário
- PUT `/api/users/profile` - Atualizar perfil
- PUT `/api/users/change-password` - Mudar senha
- DELETE `/api/users/account` - Deletar conta

### 3. Transações Financeiras 💰
- POST `/api/transactions` - Criar
- GET `/api/transactions` - Listar
- PUT `/api/transactions/:id` - Atualizar
- DELETE `/api/transactions/:id` - Deletar (soft)
- GET `/api/transactions/summary` - Resumo
- GET `/api/transactions/by-category` - Por categoria

**Tipos:** INCOME, EXPENSE, INVESTMENT
**Categorias:** ALIMENTACAO, TRANSPORTE, LAZER, SAUDE, etc
**Pagamento:** PIX, BOLETO, CARTAO, TRANSFERENCIA, DINHEIRO

### 4. Extração de Imagem 🤖📷
POST `/api/transactions/extract-from-image`

**Fluxo:**
1. Upload foto de extrato/comprovante
2. Google Vision extrai texto (OCR)
3. OpenAI GPT estrutura dados
4. Retorna JSON com: descrição, valor, tipo, categoria, data

### 5. Relatórios com IA 🤖📈
GET `/api/transactions/report?month=10&year=2025`

**O que faz:**
1. Busca transações do período
2. Calcula estatísticas completas
3. Compara com mês anterior
4. Envia para OpenAI com prompt otimizado
5. Retorna 9 tipos de insights:
   - Visão geral motivacional
   - Pontos positivos (3-4)
   - Pontos de atenção (2-3)
   - Análise top 3 categorias
   - Dicas personalizadas (4-6)
   - Metas para próximo mês
   - Comparação inteligente
   - Curiosidade financeira
   - Score de saúde (0-100)

---

## 💻 Padrões de Código

### Entidade (Domain)
```typescript
export class User extends Entity {
  private constructor(...) {
    super(id, createdAt, updatedAt);
    this.validate();
  }

  // Factory para CRIAR
  static create(data): User {
    // Valida + hash
  }

  // Factory para HIDRATAR do banco
  static with(data): User {
    // Sem validação
  }

  // Apenas getters (imutável)
  getEmail(): string { return this.email; }
}
```

### Use Case (Application)
```typescript
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userGateway: UserGateway
  ) {}

  async execute(input): Promise<output> {
    // 1. Validar regras de negócio
    // 2. Criar entidade
    // 3. Persistir via gateway
    // 4. Retornar output
  }
}
```

### Repository (Infrastructure)
```typescript
@Injectable()
export class UserPrismaRepository extends UserGateway {
  async findByEmail(email): Promise<User | null> {
    const model = await prismaClient.user.findUnique({...});
    if (!model) return null;
    return UserMapper.toDomain(model);
  }
}
```

### Controller (HTTP)
```typescript
@Controller('users')
export class CreateUserRoute {
  @Post()
  @IsPublic()
  async handle(@Body() body) {
    const validated = schema.parse(body);
    const output = await this.usecase.execute(validated);
    return Presenter.toHttp(output);
  }
}
```

---

## 📚 Estudando o Código

### Ordem Recomendada:

#### 1. Domínio (Puro)
1. `src/domain/entities/user/user.entity.ts`
2. `src/domain/entities/transaction/transaction.entity.ts`
3. `src/domain/repositories/user.gateway.ts`

#### 2. Casos de Uso
1. `src/usecases/user/create/create-user.usecase.ts`
2. `src/usecases/user/login/login-user.usecase.ts`
3. `src/usecases/transaction/create/create-transaction.usecase.ts`

#### 3. Infraestrutura
1. `src/infra/repositories/prisma/user/`
2. `src/infra/services/jwt/jwt.service.ts`
3. `src/infra/web/routes/user/create/`

#### 4. Avançado (IA)
1. `src/usecases/transaction/extract-from-image/`
2. `src/usecases/transaction/generate-report/`
3. `src/infra/services/ai-insights/openai/`

### Conceitos Importantes:

**Repository Pattern:**
- Abstrai persistência de dados
- Interface no domínio, implementação na infra
- Use case depende da abstração

**Dependency Injection:**
- Classes marcadas com `@Injectable()`
- Injeção via construtor
- Configurado nos módulos

**Exception Filters:**
- Exceções específicas por caso de uso
- Filters capturam e formatam resposta HTTP
- Mensagens internas (log) e externas (usuário)

---

## 🧪 Testes

```bash
# Testes unitários
npm test

# Watch mode
npm run test:watch

# Cobertura
npm run test:cov

# E2E
npm run test:e2e
```

---

## 📖 Recursos

- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [DDD](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

## 🤝 Dúvidas?

1. Leia a [Documentação Completa](../DOCUMENTATION.md)
2. Verifique comentários no código
3. Abra uma issue no GitHub

---

**Desenvolvido para aprendizado 💚**
