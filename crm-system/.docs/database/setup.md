# Inicializacao do banco de dados

Este guia prepara o PostgreSQL, o backend e o Prisma 7 para desenvolvimento local.
Ele deve ser seguido depois de clonar o repositorio e antes de criar funcionalidades
que dependam do banco.

## Pre-requisitos

- Docker Desktop instalado e em execucao.
- Node.js 20.19 ou superior para executar comandos do Prisma no host.
- Git instalado.

Os comandos abaixo partem da pasta `crm-system`.

## 1. Configurar o Compose

Crie `crm-system/.env` a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

Confira estes valores:

```dotenv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=xxxxxx
POSTGRES_DB=postgres
POSTGRES_PORT=5433
BACKEND_PORT=3001
FRONTEND_PORT=3000
```

`POSTGRES_PORT` e a porta do Windows. O PostgreSQL continua ouvindo na porta
`5432` dentro do container. A porta `5433` evita conflito com uma instalacao
local do PostgreSQL que possa estar usando `5432`.

## 2. Configurar o backend

Crie o arquivo a partir do exemplo:

```powershell
Copy-Item backend/.env.example backend/.env
```

Confira se `crm-system/backend/.env` contem:

```dotenv
DATABASE_URL="postgresql://postgres:xxxxxx@postgres:5432/postgres?schema=public"
BACKEND_PORT=3001
NODE_ENV=development
JWT_SECRET=change-this-secret-locally
```

A URL acima e usada pelo backend dentro do Docker. O hostname `postgres` e o
nome do servico no `docker-compose.yml`; ele funciona dentro da rede Docker.

Se for executar Prisma diretamente no Windows, use a porta publicada:

```dotenv
DATABASE_URL="postgresql://postgres:prisma@localhost:5433/postgres?schema=public"
```

Nao use `postgres:5432` em um comando executado no Windows: esse nome somente
existe no DNS interno da rede do Compose.

## 3. Subir o PostgreSQL e o backend

Na pasta `crm-system`:

```powershell
docker compose up -d --build postgres backend
```

Verifique o estado:

```powershell
docker compose ps
```

O servico `postgres` deve aparecer como `healthy` e o `backend` deve estar em
execucao. O volume `postgres_data` e criado automaticamente e monta em
`/var/lib/postgresql/data`, mantendo os dados quando os containers sao parados.

## 4. Criar ou aplicar as tabelas

O fluxo recomendado e executar a migration dentro do backend, na rede Docker:

```powershell
docker compose exec backend npx prisma migrate dev --name init
```

Esse comando cria a migration em `backend/prisma/migrations`, aplica as tabelas
no PostgreSQL e atualiza o Prisma Client.

Para o primeiro setup, o nome `init` e adequado. Para alteracoes posteriores,
use um nome descritivo, por exemplo:

```powershell
docker compose exec backend npx prisma migrate dev --name add_cliente_status
```

## 5. Iniciar o frontend

Quando o banco e o backend estiverem funcionando:

```powershell
docker compose up -d frontend
```

URLs locais:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- PostgreSQL no host: `localhost:5433`

## Comandos do dia a dia

```powershell
# Iniciar os servicos ja construidos
docker compose up -d

# Ver logs do backend
docker compose logs -f backend

# Ver logs do PostgreSQL
docker compose logs -f postgres

# Parar containers sem apagar dados
docker compose down

# Conferir a versao do Prisma dentro do backend
docker compose exec backend npx prisma --version

# Ver o estado das migrations
docker compose exec backend npx prisma migrate status
```

## Volume e perda de dados

`docker compose down` preserva o volume. Nao use `-v` durante o desenvolvimento
normal.

O comando abaixo remove o volume e todos os dados do banco:

```powershell
docker compose down -v
```

Use-o somente para recriar um banco descartavel do zero. Depois, suba novamente
o PostgreSQL e o backend e aplique as migrations.

## Problemas comuns

### `P1001` ou hostname `postgres` nao encontrado

O Prisma esta sendo executado no Windows com uma URL destinada ao Docker. Troque
`postgres:5432` por `localhost:5433` no `backend/.env`, ou execute a migration
dentro do container com `docker compose exec backend ...`.

### `P1000` ou falha de autenticacao

As variaveis `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB` somente sao
aplicadas quando o volume e inicializado pela primeira vez. Se o volume ja foi
criado com outra senha, atualizar o `.env` nao muda a senha existente.

Em um ambiente local descartavel, recrie o banco:

```powershell
docker compose down -v
docker compose up -d --build postgres backend
docker compose exec backend npx prisma migrate dev --name init
```

### Prisma mostra uma versao antiga

Reconstrua o backend e recrie o container:

```powershell
docker compose rm -sf backend
docker compose up -d --build postgres backend
docker compose exec backend npx prisma --version
```

A versao esperada e Prisma `7.x`.

### Porta `5433` ocupada

Escolha outra porta livre no `crm-system/.env`, por exemplo `5434`, e use a
mesma porta na URL do host:

```dotenv
POSTGRES_PORT=5434
DATABASE_URL="postgresql://postgres:prisma@localhost:5434/postgres?schema=public"
```

Dentro do Docker, a URL do backend continua usando `postgres:5432`.

## Fluxo para novas migrations

1. Altere `backend/prisma/schema.prisma`.
2. Execute `docker compose exec backend npx prisma migrate dev --name nome_da_mudanca`.
3. Verifique a migration criada em `backend/prisma/migrations`.
4. Inclua schema e migration no commit.
5. Avise o time para atualizar o branch e subir os containers.

Nao edite manualmente uma migration que ja foi aplicada em outro ambiente.