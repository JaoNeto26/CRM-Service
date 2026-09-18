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

## Depois do setup inicial

O arquivo `backend/prisma/schema.prisma` e a fonte do modelo de dados. As
migrations sao o historico versionado das alteracoes aplicadas ao PostgreSQL.
Sempre que o schema mudar, o fluxo normal e:

1. Edite o schema.
2. Valide o schema.
3. Crie e aplique uma migration local.
4. Revise o SQL gerado.
5. Gere o Prisma Client e rode os testes/build.
6. Inclua `schema.prisma` e a nova pasta em `prisma/migrations` no commit.

## Comandos principais

Execute os comandos abaixo na pasta `crm-system` usando o container:

```powershell
# Validar sintaxe e relacoes do schema
docker compose exec backend npx prisma validate

# Criar uma migration durante o desenvolvimento e aplica-la
docker compose exec backend npx prisma migrate dev --name nome_descritivo

# Atualizar o Prisma Client depois de alterar o schema
docker compose exec backend npx prisma generate

# Ver migrations aplicadas e pendentes
docker compose exec backend npx prisma migrate status

# Abrir uma interface para consultar os dados
docker compose exec backend npx prisma studio
```

O Prisma Studio normalmente fica disponivel em `http://localhost:5555`. Se a
porta nao estiver publicada pelo container, execute o Studio no host usando um
`DATABASE_URL` com `localhost:5433`:

```powershell
Push-Location backend
npx prisma studio
Pop-Location
```

## Atualizar o banco em cada ambiente

### Desenvolvimento local

Use `migrate dev`. Ele compara o schema com o banco, cria uma migration e
atualiza o client. O nome deve explicar a mudanca, por exemplo:

```powershell
docker compose exec backend npx prisma migrate dev --name add_business_hours
```

Depois confira a pasta criada em `backend/prisma/migrations` e o SQL gerado.

### Homologacao ou producao

Nao use `migrate dev` nem `db push` nesses ambientes. Depois de revisar e
versionar a migration, aplique somente o historico existente:

```powershell
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma generate
```

O comando `migrate deploy` nao cria migrations e nao pede reset do banco.

### Prototipos descartaveis

`db push` sincroniza o schema sem criar historico de migration. Use apenas para
experimentos locais que nao precisam ser compartilhados:

```powershell
docker compose exec backend npx prisma db push
docker compose exec backend npx prisma generate
```

Assim que a estrutura ficar definitiva, volte para `migrate dev` e registre uma
migration versionada.

## Estado atual deste repositorio

Ja existe uma migration `20260820022123_init`, criada para o schema anterior.
Como o schema atual foi substituido pelo modelo do DBML, ele nao corresponde
mais ao SQL dessa migration.

Se o banco local for descartavel, recrie o volume e gere o historico novamente
antes de continuar:

```powershell
docker compose down -v
docker compose up -d --build postgres backend
docker compose exec backend npx prisma migrate dev --name dbml_initial
```

Esse procedimento apaga todos os dados locais. A migration antiga continua no
historico versionado e o `migrate dev` criara uma nova migration de transicao
para chegar ao modelo do DBML. Se houver dados que precisam ser preservados, nao
use `down -v`: execute `migrate dev` e revise cuidadosamente a migration de
transicao e seus comandos de conversao de dados antes de aplica-la. Faca backup
do banco antes de uma mudanca estrutural.

## Alteracoes seguras no schema

- Prefira adicionar colunas opcionais antes de torna-las obrigatorias.
- Ao renomear ou remover uma coluna, verifique se a migration nao vai apagar
  dados silenciosamente.
- Para valores historicos, como preco no momento do agendamento, mantenha uma
  coluna de snapshot em vez de depender do valor atual do servico.
- IDs novos devem continuar usando `cuid()` conforme o schema atual.
- Nao altere uma migration ja aplicada em outro ambiente; crie uma nova.
- Nao faca `db push` para corrigir um banco compartilhado.

## Diagnostico rapido

### Schema valido, mas o client nao reconhece um model

O client gerado esta desatualizado. Gere-o novamente e reinicie o backend:

```powershell
docker compose exec backend npx prisma generate
docker compose restart backend
```

### `migrate dev` pede reset por causa de drift

O banco nao corresponde ao historico de migrations. Primeiro execute:

```powershell
docker compose exec backend npx prisma migrate status
```

Em banco descartavel, use `docker compose down -v` e reaplique as migrations.
Em banco com dados, pare e revise o drift; nao confirme o reset sem backup e
sem entender quais dados serao removidos.

### Migration falha por banco indisponivel

Confirme que o PostgreSQL esta saudavel e que a URL corresponde ao local onde o
comando roda:

```powershell
docker compose ps
docker compose logs postgres
```

Dentro do Docker use `postgres:5432`. No Windows use `localhost:5433` (ou a
porta definida em `POSTGRES_PORT`).

### Migration foi interrompida ou ficou como aplicada parcialmente

Nao apague a pasta da migration nem edite o historico manualmente. Consulte o
status, verifique os logs e corrija a causa. O comando `prisma migrate resolve`
existe para casos de recuperacao controlada, mas deve ser usado somente depois
de confirmar o estado real do banco e com a orientacao de quem administra o
ambiente.

## Checklist antes de abrir um PR

```powershell
docker compose exec backend npx prisma validate
docker compose exec backend npx prisma migrate status
docker compose exec backend npx prisma generate
Push-Location backend
npm run build
npm test -- --run
Pop-Location
```

Confirme tambem que a migration nova esta no commit, que o SQL foi revisado e
que nenhuma informacao existente sera perdida sem uma decisao explicita.
