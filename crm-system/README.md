# CRM System

Sistema de CRM full-stack.

## Stack
- **Frontend:** React + TypeScript
- **Backend:** Node.js + TypeScript (Express) + Prisma ORM
- **Banco de dados:** PostgreSQL
- **Infra:** Docker + Docker Compose
- **CI/CD:** GitHub Actions

## Estrutura

```
crm-system/
├── backend/          # API REST em Node/TypeScript
├── frontend/         # Aplicação React
├── docker-compose.yml
└── .github/workflows # Pipelines de CI/CD
```

## Como rodar localmente

```bash
cp .env.example .env
docker-compose up --build
```

- Backend: http://localhost:3001
- Frontend: http://localhost:3000
- Postgres: localhost:5432

## Comandos úteis

```bash
# Rodar migrations do Prisma
docker-compose exec backend npx prisma migrate dev

# Ver logs
docker-compose logs -f backend

# Parar tudo
docker-compose down
```
