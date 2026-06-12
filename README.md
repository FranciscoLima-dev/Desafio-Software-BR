# Task Manager

Sistema de gerenciamento de tarefas desenvolvido para um processo seletivo. O projeto foi feito como uma aplicacao full stack, com frontend em React e backend em Node.js, usando PostgreSQL/Supabase como banco de dados.

A ideia principal foi manter o codigo organizado por camadas, com responsabilidades bem separadas e um fluxo claro entre frontend, API e banco.

## Link do deploy

Deploy: _em breve_

## Funcionalidades implementadas

### Autenticacao

- Cadastro de usuario
- Login com email e senha
- Logout
- Hash de senha com bcrypt
- Autenticacao com JWT
- Persistencia do token no frontend
- Rotas protegidas no frontend e backend

### Tarefas

- Criacao de tarefas
- Listagem de tarefas
- Edicao de tarefas
- Exclusao logica de tarefas
- Alteracao rapida de status
- Busca textual por titulo e descricao
- Filtros por status, prioridade e responsavel
- Controle de acesso por usuario autenticado

### Dashboard

- Total de tarefas pendentes
- Total de tarefas concluidas
- Total de tarefas atrasadas
- Dados reais vindos do banco, sem mock

### Historico

- Registro de criacao, atualizacao, alteracao de status, prioridade, responsavel, prazo e exclusao
- Tela simples para consultar o historico de uma tarefa

## Arquitetura

O backend segue arquitetura em camadas:

```text
Request
-> Route
-> Controller
-> Service
-> Repository
-> Database
```

Responsabilidades:

- `routes`: define os endpoints e aplica middlewares/validacoes.
- `controllers`: recebem a requisicao HTTP e retornam a resposta.
- `services`: concentram as regras de negocio.
- `repositories`: fazem todo acesso ao Prisma.
- `middlewares`: autenticacao, validacao e tratamento global de erros.
- `schemas`: validacoes com Zod.
- `config`: configuracoes de ambiente e Prisma.
- `utils`: helpers compartilhados, como `ApiError`.

No frontend, a organizacao segue a separacao:

- `pages`: telas da aplicacao.
- `components`: componentes reutilizaveis.
- `services`: chamadas HTTP para a API.
- `contexts`: estado global, como autenticacao.
- `routes`: definicao das rotas e protecao.
- `types`: tipos compartilhados.
- `utils`: formatadores, validacoes e helpers.

## Estrutura de pastas

```text
task-manager/
  backend/
    prisma/
      migrations/
      schema.prisma
    src/
      config/
      controllers/
      middlewares/
      repositories/
      routes/
      schemas/
      services/
      types/
      utils/
  frontend/
    src/
      components/
        form/
        tasks/
        ui/
      contexts/
      layouts/
      pages/
        auth/
        dashboard/
        tasks/
      routes/
      services/
      types/
      utils/
  docs/
  .env.example
  README.md
```

## Tecnologias utilizadas

### Frontend

- React
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod
- Tailwind CSS
- Axios
- Sonner

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- Zod

### Banco de dados

- PostgreSQL
- Supabase

## Banco de dados e Prisma

O banco possui as principais tabelas:

- `users`: usuarios da aplicacao
- `tasks`: tarefas do usuario
- `task_history`: historico de alteracoes das tarefas

As tarefas possuem `deletedAt` para exclusao logica. Isso permite manter o historico da tarefa mesmo depois de ela ser removida da listagem principal.

Enums usados:

- `TaskStatus`: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- `TaskPriority`: `LOW`, `MEDIUM`, `HIGH`
- `TaskHistoryAction`: acoes registradas no historico

Comandos principais do Prisma:

```bash
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate
```

## Variaveis de ambiente

Use o arquivo `.env.example` como base.

```env
# Backend
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_manager?schema=public"
PORT=3333
JWT_SECRET="change-me-to-a-secure-32-character-secret"
JWT_EXPIRES_IN="1d"
CORS_ORIGIN="http://localhost:5173"

# Frontend
VITE_API_URL="http://localhost:3333/api"
```

Exemplo usando Supabase Session Pooler:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
```

Observacao: no Supabase, quando a senha aparecer em exemplos com colchetes, os colchetes nao devem ir para o `.env`.

## Instalacao

Clone o projeto e instale as dependencias na raiz:

```bash
npm install
```

Depois configure o arquivo de ambiente:

```bash
cp .env.example backend/.env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example backend/.env
```

Edite `backend/.env` com os dados reais do banco e JWT.

## Execucao local

Rode as migrations:

```bash
npm --prefix backend run prisma:migrate
```

Inicie o backend:

```bash
npm run dev:backend
```

Em outro terminal, inicie o frontend:

```bash
npm run dev:frontend
```

URLs locais:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333`
- Health check: `http://localhost:3333/health`

## Comandos disponiveis

Na raiz:

```bash
npm run dev:backend
npm run dev:frontend
npm run build
npm run lint
```

Backend:

```bash
npm --prefix backend run dev
npm --prefix backend run build
npm --prefix backend run start
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate
```

Frontend:

```bash
npm --prefix frontend run dev
npm --prefix frontend run build
npm --prefix frontend run preview
```

## Processo de build

O build completo e executado pela raiz:

```bash
npm run build
```

Esse comando:

1. Compila o backend com TypeScript.
2. Compila o frontend com TypeScript.
3. Gera o bundle de producao com Vite.

## Decisoes arquiteturais

- Controllers nao acessam Prisma diretamente.
- Regras de negocio ficam nos services.
- Todo acesso ao banco fica nos repositories.
- As rotas de tarefas e dashboard exigem JWT.
- Todas as consultas de tarefas usam `userId` do usuario autenticado.
- Erros de negocio usam `ApiError`.
- O backend possui `globalErrorHandler` para padronizar respostas.
- O frontend usa Axios com interceptor para enviar o token automaticamente.
- O frontend usa `AuthContext` para centralizar sessao e logout.
- A exclusao de tarefas e logica para preservar historico.

## Capturas de tela

As capturas podem ser adicionadas nesta secao quando o projeto estiver com deploy ou imagens finais.

### Login

_Adicionar imagem da tela de login._

### Cadastro

_Adicionar imagem da tela de cadastro._

### Dashboard

_Adicionar imagem da tela do dashboard._

### Listagem de tarefas

_Adicionar imagem da listagem de tarefas._

### Formulario de tarefa

_Adicionar imagem da criacao/edicao de tarefa._

### Historico da tarefa

_Adicionar imagem da tela de historico._

## Possiveis melhorias futuras

- Paginacao na listagem de tarefas
- Ordenacao por prioridade, status e data limite
- Modal proprio para confirmacao de exclusao
- Testes automatizados no backend e frontend
- Refresh token ou estrategia de renovacao de sessao
- Deploy do frontend e backend
- Documentacao OpenAPI/Swagger
- Perfil do usuario
- Responsaveis como entidade separada
- Notificacoes para tarefas atrasadas
- Melhorias de acessibilidade e navegacao por teclado

## Status

Projeto funcional localmente, com backend, banco, autenticacao, tarefas, dashboard e frontend autenticado integrados.
