# Arquitetura

## Visao geral

O projeto usa uma separacao full-stack por aplicacao:

- `backend`: API HTTP em Node.js, Express, TypeScript, Prisma e PostgreSQL.
- `frontend`: SPA em React, TypeScript, Vite, React Router, React Hook Form, Zod, Tailwind CSS e Axios.

## Backend

Fluxo obrigatorio:

`Request -> Route -> Controller -> Service -> Repository -> Database`

Responsabilidades:

- `routes`: define endpoints, middlewares e validadores.
- `controllers`: traduz HTTP para chamadas de service e formata respostas.
- `services`: concentra regras de negocio.
- `repositories`: concentra todo acesso Prisma.
- `middlewares`: autenticacao, validacao e tratamento global de erros.
- `schemas`: contratos Zod para entrada de dados.
- `config`: variaveis de ambiente e clientes compartilhados.
- `utils`: utilitarios transversais, como `ApiError`.

## Frontend

Responsabilidades:

- `pages`: telas de rota.
- `layouts`: estruturas compartilhadas de tela.
- `routes`: declaracao de navegacao.
- `services`: clientes HTTP e integracoes externas.
- `contexts`: estado global de sessao e preferencias.
- `hooks`: composicao de estado e efeitos reutilizaveis.
- `components`: componentes visuais e formularios.
- `types`: contratos da interface.
- `utils`: funcoes puras auxiliares.

## Decisoes iniciais

- JWT sera transportado pelo frontend em chamadas autenticadas via Axios interceptor.
- Todo endpoint de tarefa sera protegido e filtrado por `userId`.
- Historico sera derivado no service de tarefas antes de persistir alteracoes.
- Dashboard sera calculado a partir do banco, sem dados mockados.
- Erros terao formato unico com `success: false` e `message`.
