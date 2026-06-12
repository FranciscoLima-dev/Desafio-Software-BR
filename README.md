# Task Manager

Sistema full stack de gerenciamento de tarefas desenvolvido para um desafio técnico.

O projeto está publicado e funcional, com frontend na Vercel, backend no Render e banco
PostgreSQL hospedado no Supabase. A aplicação permite cadastro, login, controle de sessão,
gerenciamento de tarefas, filtros combináveis, dashboard com indicadores reais e histórico de
alterações.

## Demonstração

- Frontend: [https://desafio-software-br-frontend.vercel.app](https://desafio-software-br-frontend.vercel.app)
- Backend: [https://desafio-software-br.onrender.com](https://desafio-software-br.onrender.com)
- Health check da API: [https://desafio-software-br.onrender.com/health](https://desafio-software-br.onrender.com/health)

### Conta de teste

```text
E-mail: Usuarioteste@gmail.com
Senha: Teste123
```

### Fluxo sugerido para avaliação

1. Acessar o frontend publicado.
2. Entrar com a conta de teste ou criar um novo usuário.
3. Conferir os indicadores do dashboard.
4. Criar uma tarefa com prioridade, responsável e data limite.
5. Filtrar tarefas por status, prioridade, responsável e data limite.
6. Usar a pesquisa por título ou descrição.
7. Alterar o status da tarefa.
8. Editar os dados da tarefa.
9. Consultar o histórico de alterações.
10. Excluir a tarefa usando o modal de confirmação.
11. Fazer logout.

## Checklist de Funcionalidades

- [x] Cadastro de usuário
- [x] Login
- [x] Logout
- [x] Proteção de rotas
- [x] Controle de acesso por usuário
- [x] CRUD de tarefas
- [x] Status da tarefa
- [x] Prioridade
- [x] Responsável
- [x] Data limite
- [x] Identificação de tarefas atrasadas
- [x] Filtros por status, prioridade, responsável e data limite
- [x] Pesquisa por título e descrição
- [x] Dashboard com indicadores reais
- [x] Histórico de alterações
- [x] Persistência em banco de dados
- [x] Deploy do frontend
- [x] Deploy do backend

## Arquitetura

O projeto foi organizado como um monorepo com duas aplicações principais:

- `frontend`: aplicação React com Vite, responsável pela interface, rotas client-side, sessão do
  usuário e consumo da API.
- `backend`: API REST em Node.js e Express, responsável por autenticação, regras de negócio,
  validação, persistência e segurança das rotas.
- `backend/prisma`: modelagem do banco, migrations e configuração do Prisma ORM.

### Frontend

O frontend segue uma estrutura simples e separada por responsabilidade:

- `pages`: telas da aplicação.
- `components`: componentes reutilizáveis de formulário, tarefas e interface.
- `services`: chamadas HTTP para o backend usando Axios.
- `contexts`: estado global de autenticação.
- `routes`: configuração de rotas e proteção de páginas autenticadas.
- `utils`: validações, formatações e helpers.
- `types`: tipos compartilhados da aplicação.

A URL da API é configurada por `VITE_API_URL`. Em produção, essa variável aponta para o backend
publicado no Render.

### Backend

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

- `routes`: definem endpoints, validadores e middlewares.
- `controllers`: recebem a requisição HTTP e retornam a resposta.
- `services`: concentram regras de negócio.
- `repositories`: centralizam todo acesso ao Prisma.
- `middlewares`: autenticação, validação e tratamento global de erros.
- `schemas`: validações com Zod.
- `config`: configuração de ambiente e Prisma.
- `utils`: helpers compartilhados, como `ApiError`.

Essa separação evita que controllers acessem diretamente o banco e mantém as regras de negócio
fora das rotas.

### Banco de dados

O banco usado é PostgreSQL, hospedado no Supabase. A modelagem principal possui:

- `users`: usuários da aplicação.
- `tasks`: tarefas vinculadas ao usuário autenticado.
- `task_history`: histórico de alterações das tarefas.

As tarefas usam `deletedAt` para exclusão lógica. Dessa forma, a tarefa deixa de aparecer na
listagem principal, mas seu histórico continua preservado.

Enums principais:

- `TaskStatus`: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- `TaskPriority`: `LOW`, `MEDIUM`, `HIGH`
- `TaskHistoryAction`: ações registradas no histórico

## Tecnologias Utilizadas

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

### Banco e Deploy

- Supabase/PostgreSQL
- Vercel
- Render

## Estrutura de Pastas

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

## Variáveis de Ambiente

Use o arquivo `.env.example` como referência.

### Backend

| Variável         | Descrição                                                  |
| ---------------- | ---------------------------------------------------------- |
| `DATABASE_URL`   | Connection string do PostgreSQL/Supabase                   |
| `JWT_SECRET`     | Chave usada para assinar os tokens JWT                     |
| `JWT_EXPIRES_IN` | Tempo de expiração do token, por exemplo `1d`              |
| `CORS_ORIGIN`    | URL do frontend liberada no CORS                           |
| `PORT`           | Porta local da API; em produção o Render injeta esse valor |

Exemplo local:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_manager?schema=public"
PORT=3333
JWT_SECRET="change-me-to-a-secure-32-character-secret"
JWT_EXPIRES_IN="1d"
CORS_ORIGIN="http://localhost:5173"
```

Em produção no Render:

```env
DATABASE_URL="connection-string-do-supabase"
JWT_SECRET="segredo-com-no-minimo-32-caracteres"
JWT_EXPIRES_IN="1d"
CORS_ORIGIN="https://desafio-software-br-frontend.vercel.app"
```

### Frontend

| Variável       | Descrição                  |
| -------------- | -------------------------- |
| `VITE_API_URL` | URL base da API com `/api` |

Exemplo local:

```env
VITE_API_URL="http://localhost:3333/api"
```

Em produção na Vercel:

```env
VITE_API_URL="https://desafio-software-br.onrender.com/api"
```

## Execução Local

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd task-manager
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie o arquivo de ambiente do backend:

```bash
cp .env.example backend/.env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example backend/.env
```

Depois, edite `backend/.env` com os dados reais do banco, JWT e CORS.

Para rodar o frontend localmente usando outro backend, configure `VITE_API_URL` em um arquivo de
ambiente dentro de `frontend` ou use a variável no ambiente de execução.

### 4. Rodar Prisma e migrations

Gere o Prisma Client:

```bash
npm --prefix backend run prisma:generate
```

Rode as migrations quando estiver configurando o banco pela primeira vez ou quando houver mudança de
schema:

```bash
npm --prefix backend run prisma:migrate
```

### 5. Rodar backend

```bash
npm run dev:backend
```

Backend local:

```text
http://localhost:3333
```

Health check:

```text
http://localhost:3333/health
```

### 6. Rodar frontend

Em outro terminal:

```bash
npm run dev:frontend
```

Frontend local:

```text
http://localhost:5173
```

## Comandos Disponíveis

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

O build completo é executado pela raiz:

```bash
npm run build
```

Esse comando:

1. Gera o Prisma Client.
2. Compila o backend com TypeScript.
3. Compila o frontend com TypeScript.
4. Gera o bundle de produção com Vite.

## Deploy

### Backend no Render

Configuração usada:

- Root Directory: `backend`
- Build Command: `npm ci && npx prisma generate && npm run build`
- Start Command: `npm run start`

O backend usa `process.env.PORT`, então a porta injetada pelo Render é respeitada automaticamente.

### Frontend na Vercel

Configuração usada:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

O arquivo `frontend/vercel.json` faz rewrite das rotas client-side para `index.html`, permitindo
acessar rotas como `/login`, `/dashboard` e `/tasks` diretamente pelo navegador.

## Decisões Técnicas

- **React + TypeScript**: usados no frontend para criar uma interface tipada, componentizada e mais
  fácil de manter.
- **Express + TypeScript**: usado no backend pela simplicidade para criar APIs REST com tipagem e
  organização em camadas.
- **Prisma ORM**: centraliza o acesso ao banco, mantém a modelagem versionada e reduz SQL manual.
- **PostgreSQL/Supabase**: banco relacional adequado para usuários, tarefas e histórico de
  alterações.
- **JWT**: usado para autenticação stateless entre frontend e backend.
- **bcrypt**: usado para armazenar senhas com hash.
- **Zod**: usado para validação de entradas no frontend e no backend.
- **Axios com interceptor**: envia o token JWT automaticamente nas requisições protegidas.
- **Vercel e Render**: usados para separar o deploy do frontend e da API, mantendo o monorepo simples.

## Como Testar em Produção

1. Acesse [https://desafio-software-br-frontend.vercel.app](https://desafio-software-br-frontend.vercel.app).
2. Entre com a conta de teste ou crie uma nova conta.
3. Acesse o dashboard e confira os indicadores.
4. Crie uma tarefa com data limite.
5. Use filtros por status, prioridade, responsável e data limite.
6. Pesquise por título ou descrição.
7. Altere o status da tarefa.
8. Edite a tarefa.
9. Consulte o histórico.
10. Exclua a tarefa.
11. Faça logout.

## Possíveis Melhorias Futuras

- Testes automatizados no backend e no frontend.
- Documentação Swagger/OpenAPI para a API.
- Refresh token para melhorar a experiência de sessão.
- Upload de avatar para o perfil do usuário.
- Notificações para tarefas próximas do vencimento ou atrasadas.
- Pipeline de CI/CD com build, lint e testes automatizados.
- Paginação e ordenação avançada na listagem de tarefas.
- Melhorias de acessibilidade com revisão de foco, contraste e navegação por teclado.
