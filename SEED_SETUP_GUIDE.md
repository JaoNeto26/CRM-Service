# Guia Completo: Setup e Execução do Seed

Este documento detalha todos os passos necessários para preparar e executar o seed do banco de dados do CRM Service.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de que:

- Docker e Docker Compose estão instalados
- Os containers estão rodando (frontend, backend, postgres)
- Você está na pasta correta do projeto

---

## 🚀 Passo a Passo Completo

### 1️⃣ Verificar se os containers estão rodando

```bash
docker ps
```

**Esperado:** Você deve ver 3 containers rodando:

- `crm_frontend` (porta 3000)
- `crm_backend` (porta 3001)
- `crm_postgres` (porta 5433)

Se não estiverem rodando, execute:

```bash
cd /crm-system
docker compose up -d
```

---

### 2️⃣ Entrar na pasta do backend

```bash
cd /backend
```

---

### 3️⃣ Instalar dependências (se necessário)

Se for a primeira vez ou atualizou o `package.json`:

```bash
npm install
```

Ou dentro do container:

```bash
docker exec -it crm_backend npm install
```

---

### 4️⃣ Gerar Prisma Client

Antes de rodar o seed, o Prisma Client precisa ser gerado:

```bash
docker exec -it crm_backend npx prisma generate
```

**Esperado:** Mensagem de sucesso com `Generated Prisma Client (v7.10.0)`

---

### 5️⃣ RESETAR o banco de dados (IMPORTANTE!)

⚠️ **Este comando deleta todos os dados do banco!**

Se você quer limpar o banco completamente e começar do zero:

```bash
docker exec -it crm_backend npx prisma db push --force-reset
```

**Esperado:** Mensagem de sucesso `Your database is now in sync with your Prisma schema`

---

### 6️⃣ Rodar o Seed

Agora você pode criar os dados de teste:

```bash
docker exec -it crm_backend npx tsx prisma/seed.ts
```

**Esperado:** Saída similar a:

```
Criando dados de teste...

Seed criado com sucesso!

USUÁRIO:
cmtj05ab1000086mk62p5cfx8

EMPRESA:
cmtj05aba000186mkcav57i3i

CLIENTES:
cmtj05abq000586mkerwp0sio
cmtj05abs000686mk8iicjuno
cmtj05abu000786mksplpqvm7

SERVIÇOS:
cmtj05abe000286mki3p1t17s
cmtj05abi000386mkg0cvmitv
cmtj05abl000486mkizibhgpc

AGENDAMENTOS:
cmtj05adg000f86mk8a781496
cmtj05adm000h86mktxs8md38
cmtj05adt000j86mkaorsoxho
```

---

## 🔄 Comando Rápido (Tudo em um)

Se você quer resetar e recriar o seed em um único comando:

```bash
cd /home/maspoly/GitHub/Nova\ pasta\ 4/CRM-Service/crm-system/backend && docker exec -it crm_backend npx prisma db push --force-reset && docker exec -it crm_backend npx tsx prisma/seed.ts
```

---

## 🗑️ Opções Adicionais de Reset

### Opção A: Reset completo (com migrations)

Usa as migrations do Prisma:

```bash
docker exec -it crm_backend npx prisma migrate reset --force
```

### Opção B: Deletar apenas os dados (manter schema)

Se você quer manter a estrutura mas limpar os dados:

```bash
docker exec -it crm_backend psql -U crm_user -h postgres -d crm_database -c "TRUNCATE TABLE \"Usuario\", \"Company\", \"Customer\", \"Service\", \"Appointment\", \"AppointmentService\", \"Payment\", \"FinancialTransaction\", \"SubscriptionPlan\", \"Subscription\", \"BusinessHour\" CASCADE;"
```

Depois rodar o seed novamente:

```bash
docker exec -it crm_backend npx tsx prisma/seed.ts
```

### Opção C: Reset do container (nuclear)

Deleta e recria o container inteiro:

```bash
docker compose down
docker volume rm crm-system_postgres_data
docker compose up -d
cd backend
docker exec -it crm_backend npx prisma db push --force-reset
docker exec -it crm_backend npx tsx prisma/seed.ts
```

---

## 📊 Verificar os dados criados

### Ver dados no Prisma Studio (UI visual)

```bash
docker exec -it crm_backend npx prisma studio
```

Isso abrirá uma interface visual em `http://localhost:5555`

### Ver dados via SQL

Conectar ao banco diretamente:

```bash
docker exec -it crm_postgres psql -U crm_user -d crm_database
```

Exemplos de queries:

```sql
-- Ver usuários
SELECT * FROM "Usuario";

-- Ver empresas
SELECT * FROM "Company";

-- Ver clientes
SELECT * FROM "Customer";

-- Ver agendamentos
SELECT * FROM "Appointment";

-- Sair
\q
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```
npx prisma generate
```

### Erro: "Unique constraint failed"

O banco tem dados duplicados. Execute o reset:

```bash
docker exec -it crm_backend npx prisma db push --force-reset
```

### Erro: "Connection refused"

Os containers não estão rodando:

```bash
docker compose up -d
```

### Erro: "DATABASE_URL not found"

Certifique-se que o arquivo `.env` existe no backend com:

```
DATABASE_URL="postgresql://crm_user:1234@postgres:5432/crm_database?schema=public"
PORT=3001
NODE_ENV=development
```

---

## ✅ Checklist Completo

Antes de rodar em produção, execute este checklist:

- [ ] Docker e Docker Compose instalados
- [ ] Containers rodando (`docker ps`)
- [ ] Arquivo `.env` no backend configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] Prisma Client gerado (`npx prisma generate`)
- [ ] Banco resetado (`npx prisma db push --force-reset`)
- [ ] Seed executado (`npx tsx prisma/seed.ts`)
- [ ] Dados verificados (`npx prisma studio`)

---

## 📝 Notas Importantes

1. **Idempotência**: O seed pode ser executado múltiplas vezes sem gerar duplicatas. Ele usa `upsert` para clientes e horários de funcionamento.

2. **Dados de Teste**: O seed cria:
    - 1 usuário de teste
    - 1 empresa de barbearia
    - 3 clientes
    - 3 serviços
    - 7 horários de funcionamento (seg-dom)
    - 3 agendamentos
    - 1 pagamento
    - 1 transação financeira
    - 1 plano de assinatura
    - 1 assinatura ativa

3. **Performance**: Na primeira execução, pode levar alguns minutos. Execuções subsequentes são mais rápidas.

---

**Última atualização:** 2026-09-01
