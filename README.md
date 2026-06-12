# Task Manager

Sistema full stack de gerenciamento de tarefas desenvolvido para um desafio tecnico.

O projeto esta publicado e funcional, com frontend na Vercel, backend no Render e banco
PostgreSQL hospedado no Supabase. A aplicacao permite cadastro, login, gerenciamento de
tarefas, filtros, dashboard e historico de alteracoes.

## Status do projeto

Projeto publicado e funcional.

- Frontend: [https://desafio-software-br-frontend.vercel.app](https://desafio-software-br-frontend.vercel.app)
- Backend: [https://desafio-software-br.onrender.com](https://desafio-software-br.onrender.com)
- Health check da API: [https://desafio-software-br.onrender.com/health](https://desafio-software-br.onrender.com/health)

## Conta de teste

Use a conta abaixo para validar o fluxo em producao:

```text
Email: Usuarioteste@gmail.com
Senha: Teste123
```

Tambem e possivel criar uma nova conta pela tela de cadastro.

## Funcionalidades implementadas

### Autenticacao

- Cadastro de usuario.
- Login com email e senha.
- Logout.
- Hash de senha com bcrypt.
- Autenticacao com JWT.
- Persistencia do token no frontend.
- Rotas protegidas no frontend e no backend.
- Tratamento de credenciais invalidas.

### Tarefas

- Criacao de tarefas.
- Listagem de tarefas.
- Edicao de tarefas.
- Exclusao logica.
- Alteracao rapida de status.
- Busca textual por titulo e descricao.
- Filtros por status, prioridade e responsavel.
- Controle de acesso por usuario autenticado.

### Dashboard

- Total de tarefas pendentes.
- Total de tarefas concluidas.
- Total de tarefas atrasadas.
- Dados reais vindos do banco.

### Historico

- Registro de criacao, atualizacao, alteracao de status, prioridade, responsavel, prazo e exclusao.
- Tela simples para consulta do historico de cada tarefa.

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

Responsabilidades principais:

- `routes`: definem endpoints, middlewares e validacoes.
- `controllers`: recebem a requisicao HTTP e retornam a resposta.
- `services`: concentram regras de negocio.
- `repositories`: centralizam todo acesso ao Prisma.
- `middlewares`: autenticacao, validacao e tratamento global de erros.
- `schemas`: validacoes com Zod.
- `config`: configuracoes de ambiente e Prisma.
- `utils`: helpers compartilhados, como `ApiError`.

No frontend, a organizacao segue uma separacao simples:

- `pages`: telas da aplicacao.
- `components`: componentes reutilizaveis.
- `services`: chamadas HTTP para a API.
- `contexts`: estado global, como autenticacao.
- `routes`: definicao das rotas e protecao de paginas.
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
  .prettierrc
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

Principais tabelas:

- `users`: usuarios da aplicacao.
- `tasks`: tarefas criadas pelos usuarios.
- `task_history`: historico de alteracoes das tarefas.

As tarefas usam `deletedAt` para exclusao logica. Assim, a tarefa deixa de aparecer na
listagem principal, mas o historico continua preservado.

Enums principais:

- `TaskStatus`: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- `TaskPriority`: `LOW`, `MEDIUM`, `HIGH`
- `TaskHistoryAction`: acoes registradas no historico

Comandos do Prisma:

```bash
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate
```

## Variaveis de ambiente

Use o arquivo `.env.example` como referencia.

### Backend

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_manager?schema=public"
PORT=3333
JWT_SECRET="change-me-to-a-secure-32-character-secret"
JWT_EXPIRES_IN="1d"
CORS_ORIGIN="http://localhost:5173"
```

Em producao no Render, as variaveis sao configuradas no painel do servico. O backend nao
depende de arquivo `.env` em producao.

Para Supabase, use a connection string do projeto, por exemplo:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
```

### Frontend

```env
VITE_API_URL="http://localhost:3333/api"
```

Em producao na Vercel:

```env
VITE_API_URL="https://desafio-software-br.onrender.com/api"
```

## Instalacao

Instale as dependencias na raiz do projeto:

```bash
npm install
```

Crie o arquivo de ambiente do backend:

```bash
cp .env.example backend/.env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example backend/.env
```

Depois, edite `backend/.env` com os dados reais do banco e do JWT.

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
npm run format
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

## Build

O build completo e executado pela raiz:

```bash
npm run build
```

Esse comando:

1. Gera o Prisma Client.
2. Compila o backend com TypeScript.
3. Compila o frontend com TypeScript.
4. Gera o bundle de producao com Vite.

## Deploy

### Backend no Render

Configuracao usada:

- Root Directory: `backend`
- Build Command: `npm ci && npx prisma generate && npm run build`
- Start Command: `npm run start`

Variaveis importantes no Render:

```env
DATABASE_URL="connection-string-do-supabase"
JWT_SECRET="segredo-com-no-minimo-32-caracteres"
JWT_EXPIRES_IN="1d"
CORS_ORIGIN="https://desafio-software-br-frontend.vercel.app"
```

O Render injeta a variavel `PORT` automaticamente.

### Frontend na Vercel

Configuracao usada:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Variavel importante na Vercel:

```env
VITE_API_URL="https://desafio-software-br.onrender.com/api"
```

O arquivo `frontend/vercel.json` redireciona rotas client-side para `index.html`, permitindo
acessar rotas como `/login` diretamente.

## Como testar em producao

1. Acesse [https://desafio-software-br-frontend.vercel.app](https://desafio-software-br-frontend.vercel.app).
2. Entre com a conta de teste ou crie um novo usuario.
3. Acesse o dashboard.
4. Crie uma tarefa.
5. Filtre por status, prioridade ou responsavel.
6. Altere o status da tarefa.
7. Edite uma tarefa.
8. Consulte o historico da tarefa.
9. Exclua uma tarefa e confirme que ela sai da listagem.

## Fluxo de uso

1. O usuario cria uma conta ou faz login.
2. O frontend armazena o token JWT no `localStorage`.
3. O Axios envia o token no header `Authorization`.
4. O backend valida o JWT no middleware de autenticacao.
5. As rotas protegidas usam o `userId` autenticado para buscar apenas os dados do usuario.
6. Alteracoes relevantes em tarefas geram registros em `task_history`.
7. O dashboard resume as tarefas pendentes, concluidas e atrasadas.

## Decisoes arquiteturais

- Controllers nao acessam Prisma diretamente.
- Regras de negocio ficam nos services.
- Todo acesso ao banco fica nos repositories.
- Rotas de tarefas e dashboard exigem JWT.
- Consultas de tarefas sempre usam o `userId` do usuario autenticado.
- Erros de negocio usam `ApiError`.
- O backend possui `globalErrorHandler` para padronizar respostas.
- O frontend usa Axios com interceptor para enviar o token automaticamente.
- O frontend usa `AuthContext` para centralizar sessao e logout.
- A exclusao de tarefas e logica para preservar historico.

## Possiveis melhorias futuras

- Criar testes automatizados para services e repositories.
- Adicionar testes de interface nos fluxos principais.
- Implementar paginacao na listagem de tarefas.
- Adicionar ordenacao por prioridade, status e data limite.
- Criar documentacao OpenAPI/Swagger.
- Implementar refresh token.
- Melhorar acessibilidade com revisao de foco e navegacao por teclado.
- Adicionar perfil do usuario.
- Transformar responsaveis em entidade propria.
- Criar notificacoes para tarefas atrasadas.
