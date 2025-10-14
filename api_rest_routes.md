# 📡 DOCUMENTAÇÃO COMPLETA - ROTAS REST API

## 🔐 Base URL
```
http://localhost:3000/api
```

---

## 🔑 **1. AUTENTICAÇÃO (AuthModule)**

### **[POST]** `/auth/register`
**Descrição:** Registrar novo usuário  
**Público:** ✅ Sim  
**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "Senha@123"
}
```
**Resposta (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "USER"
  }
}
```

---

### **[POST]** `/auth/login`
**Descrição:** Login do usuário  
**Público:** ✅ Sim  
**Body:**
```json
{
  "email": "joao@email.com",
  "password": "Senha@123"
}
```
**Resposta (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "USER"
  }
}
```

---

### **[POST]** `/auth/refresh`
**Descrição:** Renovar access token  
**Público:** ✅ Sim  
**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```
**Resposta (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### **[POST]** `/auth/logout`
**Descrição:** Logout do usuário  
**Autenticado:** 🔒 Sim  
**Headers:** `Authorization: Bearer {accessToken}`  
**Resposta (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 👤 **2. USUÁRIOS (UserModule)**

### **[GET]** `/users/me`
**Descrição:** Obter dados do usuário autenticado  
**Autenticado:** 🔒 Sim  
**Headers:** `Authorization: Bearer {accessToken}`  
**Resposta (200):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "USER",
  "avatar": "https://...",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

---

### **[PATCH]** `/users/me`
**Descrição:** Atualizar dados do usuário autenticado  
**Autenticado:** 🔒 Sim  
**Body:**
```json
{
  "name": "João Silva Atualizado",
  "avatar": "https://nova-url.com/avatar.jpg"
}
```
**Resposta (200):**
```json
{
  "id": 1,
  "name": "João Silva Atualizado",
  "email": "joao@email.com",
  "role": "USER",
  "avatar": "https://nova-url.com/avatar.jpg",
  "updatedAt": "2023-01-02T00:00:00.000Z"
}
```

---

### **[GET]** `/users` 🔐 ADMIN ONLY
**Descrição:** Listar todos os usuários  
**Autenticado:** 🔒 Sim  
**Permissão:** 🔐 ADMIN  
**Query Params:**
- `page` (opcional): Número da página (default: 1)
- `limit` (opcional): Itens por página (default: 10)

**Resposta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@email.com",
      "role": "USER"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

---

### **[GET]** `/users/:id` 🔐 ADMIN ONLY
**Descrição:** Obter usuário por ID  
**Autenticado:** 🔒 Sim  
**Permissão:** 🔐 ADMIN  
**Params:** `id` (number)  
**Resposta (200):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "USER",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

---

### **[DELETE]** `/users/:id` 🔐 ADMIN ONLY
**Descrição:** Deletar usuário  
**Autenticado:** 🔒 Sim  
**Permissão:** 🔐 ADMIN  
**Params:** `id` (number)  
**Resposta (200):**
```json
{
  "message": "Usuário deletado com sucesso"
}
```

---

## 💰 **3. TRANSAÇÕES (TransactionModule)**

### **[POST]** `/transactions`
**Descrição:** Criar nova transação  
**Autenticado:** 🔒 Sim  
**Body:**
```json
{
  "title": "Salário",
  "description": "Salário mensal",
  "amount": 2500.00,
  "type": "DEPOSIT",
  "paymentMethod": "PIX",
  "transactionDate": "2023-03-28T00:00:00.000Z",
  "categoryId": 1
}
```
**Resposta (201):**
```json
{
  "id": 1,
  "title": "Salário",
  "description": "Salário mensal",
  "amount": 2500.00,
  "type": "DEPOSIT",
  "paymentMethod": "PIX",
  "transactionDate": "2023-03-28T00:00:00.000Z",
  "category": {
    "id": 1,
    "name": "Renda"
  },
  "createdAt": "2023-03-28T10:00:00.000Z",
  "updatedAt": "2023-03-28T10:00:00.000Z"
}
```

---

### **[GET]** `/transactions`
**Descrição:** Listar transações do usuário autenticado  
**Autenticado:** 🔒 Sim  
**Query Params:**
- `type` (opcional): DEPOSIT | EXPENSE | INVESTMENT
- `categoryId` (opcional): ID da categoria
- `startDate` (opcional): Data inicial (ISO)
- `endDate` (opcional): Data final (ISO)
- `page` (opcional): Número da página (default: 1)
- `limit` (opcional): Itens por página (default: 10)

**Resposta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Salário",
      "amount": 2500.00,
      "type": "DEPOSIT",
      "paymentMethod": "PIX",
      "transactionDate": "2023-03-28T00:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Renda"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

---

### **[GET]** `/transactions/:id`
**Descrição:** Obter transação por ID  
**Autenticado:** 🔒 Sim  
**Params:** `id` (number)  
**Resposta (200):**
```json
{
  "id": 1,
  "title": "Salário",
  "description": "Salário mensal",
  "amount": 2500.00,
  "type": "DEPOSIT",
  "paymentMethod": "PIX",
  "transactionDate": "2023-03-28T00:00:00.000Z",
  "receiptImage": "https://...",
  "category": {
    "id": 1,
    "name": "Renda"
  },
  "createdAt": "2023-03-28T10:00:00.000Z",
  "updatedAt": "2023-03-28T10:00:00.000Z"
}
```

---

### **[PATCH]** `/transactions/:id`
**Descrição:** Atualizar transação  
**Autenticado:** 🔒 Sim  
**Params:** `id` (number)  
**Body:**
```json
{
  "title": "Salário Atualizado",
  "amount": 3000.00
}
```
**Resposta (200):**
```json
{
  "id": 1,
  "title": "Salário Atualizado",
  "amount": 3000.00,
  "type": "DEPOSIT",
  "updatedAt": "2023-03-29T10:00:00.000Z"
}
```

---

### **[DELETE]** `/transactions/:id`
**Descrição:** Deletar transação  
**Autenticado:** 🔒 Sim  
**Params:** `id` (number)  
**Resposta (200):**
```json
{
  "message": "Transação deletada com sucesso"
}
```

---

### **[GET]** `/transactions/stats`
**Descrição:** Obter estatísticas das transações  
**Autenticado:** 🔒 Sim  
**Query Params:**
- `startDate` (opcional): Data inicial
- `endDate` (opcional): Data final

**Resposta (200):**
```json
{
  "totalDeposits": 5000.00,
  "totalExpenses": 3500.00,
  "totalInvestments": 1000.00,
  "balance": 500.00,
  "expensesByCategory": [
    {
      "categoryName": "Alimentação",
      "total": 800.00,
      "percentage": 22.86
    }
  ]
}
```

---

## 🏷️ **4. CATEGORIAS (CategoryModule)**

### **[GET]** `/categories`
**Descrição:** Listar todas as categorias  
**Autenticado:** 🔒 Sim  
**Resposta (200):**
```json
[
  {
    "id": 1,
    "name": "Alimentação",
    "description": "Gastos com alimentação",
    "icon": "🍔",
    "color": "#FF6B6B"
  },
  {
    "id": 2,
    "name": "Moradia",
    "description": "Aluguel, contas",
    "icon": "🏠",
    "color": "#4ECDC4"
  }
]
```

---

### **[POST]** `/categories` 🔐 ADMIN ONLY
**Descrição:** Criar nova categoria  
**Autenticado:** 🔒 Sim  
**Permissão:** 🔐 ADMIN  
**Body:**
```json
{
  "name": "Educação",
  "description": "Cursos, livros",
  "icon": "📚",
  "color": "#95E1D3"
}
```
**Resposta (201):**
```json
{
  "id": 3,
  "name": "Educação",
  "description": "Cursos, livros",
  "icon": "📚",
  "color": "#95E1D3",
  "createdAt": "2023-03-28T10:00:00.000Z"
}
```

---

### **[PATCH]** `/categories/:id` 🔐 ADMIN ONLY
**Descrição:** Atualizar categoria  
**Autenticado:** 🔒 Sim  
**Permissão:** 🔐 ADMIN  
**Params:** `id` (number)  
**Body:**
```json
{
  "name": "Educação Atualizada"
}
```
**Resposta (200):**
```json
{
  "id": 3,
  "name": "Educação Atualizada",
  "updatedAt": "2023-03-29T10:00:00.000Z"
}
```

---

### **[DELETE]** `/categories/:id` 🔐 ADMIN ONLY
**Descrição:** Deletar categoria  
**Autenticado:** 🔒 Sim  
**Permissão:** 🔐 ADMIN  
**Params:** `id` (number)  
**Resposta (200):**
```json
{
  "message": "Categoria deletada com sucesso"
}
```

---

## 💳 **5. ASSINATURAS (SubscriptionModule)**

### **[GET]** `/subscriptions/me`
**Descrição:** Obter assinatura do usuário autenticado  
**Autenticado:** 🔒 Sim  
**Resposta (200):**
```json
{
  "id": 1,
  "plan": "PREMIUM",
  "status": "ACTIVE",
  "startDate": "2023-01-01T00:00:00.000Z",
  "endDate": "2024-01-01T00:00:00.000Z",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

---

### **[POST]** `/subscriptions`
**Descrição:** Criar/atualizar assinatura  
**Autenticado:** 🔒 Sim  
**Body:**
```json
{
  "plan": "PREMIUM",
  "endDate": "2024-01-01T00:00:00.000Z"
}
```
**Resposta (201):**
```json
{
  "id": 1,
  "plan": "PREMIUM",
  "status": "ACTIVE",
  "startDate": "2023-03-28T00:00:00.000Z",
  "endDate": "2024-01-01T00:00:00.000Z"
}
```

---

### **[PATCH]** `/subscriptions/cancel`
**Descrição:** Cancelar assinatura  
**Autenticado:** 🔒 Sim  
**Resposta (200):**
```json
{
  "id": 1,
  "plan": "PREMIUM",
  "status": "CANCELLED",
  "updatedAt": "2023-03-28T10:00:00.000Z"
}
```

---

## 🤖 **6. IA - INSIGHTS (AIInsightModule)**

### **[POST]** `/ai-insights/generate`
**Descrição:** Gerar novo insight de IA  
**Autenticado:** 🔒 Sim  
**Body:**
```json
{
  "insightType": "MONTHLY_REPORT"
}
```
**Resposta (201):**
```json
{
  "id": 1,
  "title": "Relatório Mensal - Março 2023",
  "content": "Análise completa dos seus gastos do mês...",
  "insightType": "MONTHLY_REPORT",
  "metadata": {
    "totalExpenses": 3500.00,
    "savings": 500.00
  },
  "createdAt": "2023-03-28T10:00:00.000Z"
}
```

---

### **[GET]** `/ai-insights`
**Descrição:** Listar insights do usuário  
**Autenticado:** 🔒 Sim  
**Resposta (200):**
```json
[
  {
    "id": 1,
    "title": "Relatório Mensal - Março 2023",
    "content": "Análise...",
    "insightType": "MONTHLY_REPORT",
    "createdAt": "2023-03-28T10:00:00.000Z"
  }
]
```

---

### **[GET]** `/ai-insights/:id`
**Descrição:** Obter insight por ID  
**Autenticado:** 🔒 Sim  
**Params:** `id` (number)  
**Resposta (200):**
```json
{
  "id": 1,
  "title": "Relatório Mensal - Março 2023",
  "content": "Análise completa...",
  "insightType": "MONTHLY_REPORT",
  "metadata": {},
  "createdAt": "2023-03-28T10:00:00.000Z"
}
```

---

## 📸 **7. OCR - UPLOAD DE COMPROVANTES (OCRModule)**

### **[POST]** `/ocr/upload`
**Descrição:** Upload de comprovante e extração de dados  
**Autenticado:** 🔒 Sim  
**Content-Type:** `multipart/form-data`  
**Body:**
```
file: (binary)
description: "Comprovante de mercado" (opcional)
```
**Resposta (201):**
```json
{
  "extractedData": {
    "amount": 150.50,
    "date": "2023-03-28",
    "merchant": "Supermercado XYZ",
    "paymentMethod": "CREDIT_CARD"
  },
  "receiptUrl": "https://storage.../receipt-123.jpg",
  "confidence": 0.95
}
```

---

### **[POST]** `/ocr/create-transaction`
**Descrição:** Criar transação a partir de dados do OCR  
**Autenticado:** 🔒 Sim  
**Body:**
```json
{
  "receiptUrl": "https://storage.../receipt-123.jpg",
  "title": "Supermercado XYZ",
  "amount": 150.50,
  "type": "EXPENSE",
  "paymentMethod": "CREDIT_CARD",
  "transactionDate": "2023-03-28T00:00:00.000Z",
  "categoryId": 2
}
```
**Resposta (201):**
```json
{
  "id": 10,
  "title": "Supermercado XYZ",
  "amount": 150.50,
  "type": "EXPENSE",
  "receiptImage": "https://storage.../receipt-123.jpg"
}
```

---

## 📊 **8. DASHBOARD (DashboardModule)**

### **[GET]** `/dashboard/stats`
**Descrição:** Obter estatísticas do dashboard  
**Autenticado:** 🔒 Sim  
**Query Params:**
- `startDate` (opcional): Data inicial
- `endDate` (opcional): Data final

**Resposta (200):**
```json
{
  "totalBalance": 1500.00,
  "totalDeposits": 5000.00,
  "totalExpenses": 3500.00,
  "totalInvestments": 1000.00,
  "monthlyComparison": {
    "currentMonth": 3500.00,
    "previousMonth": 3200.00,
    "percentageChange": 9.375
  },
  "expensesByCategory": [
    {
      "categoryName": "Alimentação",
      "total": 800.00,
      "percentage": 22.86
    },
    {
      "categoryName": "Moradia",
      "total": 1200.00,
      "percentage": 34.29
    }
  ]
}
```

---

### **[GET]** `/dashboard/chart`
**Descrição:** Obter dados para gráficos  
**Autenticado:** 🔒 Sim  
**Query Params:**
- `period` (opcional): WEEK | MONTH | YEAR (default: MONTH)

**Resposta (200):**
```json
{
  "period": "MONTH",
  "data": [
    {
      "date": "2023-03-01",
      "deposits": 2500.00,
      "expenses": 1200.00
    },
    {
      "date": "2023-03-02",
      "deposits": 0.00,
      "expenses": 50.00
    }
  ]
}
```

---

## 📝 **RESUMO DE ROTAS**

### **Autenticação (Público)**
- `[POST] /auth/register`
- `[POST] /auth/login`
- `[POST] /auth/refresh`
- `[POST] /auth/logout` 🔒

### **Usuários**
- `[GET] /users/me` 🔒
- `[PATCH] /users/me` 🔒
- `[GET] /users` 🔒🔐
- `[GET] /users/:id` 🔒🔐
- `[DELETE] /users/:id` 🔒🔐

### **Transações**
- `[POST] /transactions` 🔒
- `[GET] /transactions` 🔒
- `[GET] /transactions/:id` 🔒
- `[PATCH] /transactions/:id` 🔒
- `[DELETE] /transactions/:id` 🔒
- `[GET] /transactions/stats` 🔒

### **Categorias**
- `[GET] /categories` 🔒
- `[POST] /categories` 🔒🔐
- `[PATCH] /categories/:id` 🔒🔐
- `[DELETE] /categories/:id` 🔒🔐

### **Assinaturas**
- `[GET] /subscriptions/me` 🔒
- `[POST] /subscriptions` 🔒
- `[PATCH] /subscriptions/cancel` 🔒

### **IA/Insights**
- `[POST] /ai-insights/generate` 🔒
- `[GET] /ai-insights` 🔒
- `[GET] /ai-insights/:id` 🔒

### **OCR**
- `[POST] /ocr/upload` 🔒
- `[POST] /ocr/create-transaction` 🔒

### **Dashboard**
- `[GET] /dashboard/stats` 🔒
- `[GET] /dashboard/chart` 🔒

---

## 🔐 **LEGENDAS**
- ✅ = Rota pública
- 🔒 = Requer autenticação (JWT)
- 🔐 = Requer permissão ADMIN
