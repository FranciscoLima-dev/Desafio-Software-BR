# Plano de implementacao

## 1. Banco

- Instalar dependencias.
- Configurar PostgreSQL via `DATABASE_URL`.
- Rodar `prisma generate`.
- Criar primeira migration.
- Validar tabelas, enums e indices.

## 2. Auth

- Implementar `UserRepository`.
- Implementar `AuthService` com cadastro, login e logout.
- Criar hash com bcrypt.
- Criar e assinar JWT.
- Garantir email unico com erro amigavel.

## 3. Middleware

- Implementar autenticacao JWT.
- Popular `request.user`.
- Padronizar respostas de erro.
- Revisar validacao Zod por `body`, `params` e `query`.

## 4. CRUD

- Implementar `TaskRepository`.
- Implementar `TaskService`.
- Garantir escopo por `userId` em todas as consultas.
- Implementar criar, listar, buscar, editar e excluir.

## 5. Historico

- Implementar `TaskHistoryRepository`.
- Detectar alteracoes relevantes no `TaskService.update`.
- Registrar status, prioridade, responsavel e prazo.
- Criar consulta de historico por tarefa respeitando `userId`.

## 6. Dashboard

- Implementar agregacoes reais no banco.
- Retornar pendentes, concluidas e atrasadas.
- Garantir escopo por `userId`.

## 7. Filtros

- Implementar filtros combinaveis por query params.
- Implementar busca textual em titulo e descricao.
- Revisar indices e comportamento de datas.

## 8. Frontend

- Implementar layout autenticado e layout publico.
- Criar telas de login, cadastro, dashboard, tarefas, criacao, edicao e historico.
- Integrar React Hook Form e Zod.
- Integrar Axios com token e interceptors.
- Adicionar loading states, skeletons, empty states, toasts e confirmacao de exclusao.

## 9. README

- Completar visao geral.
- Documentar arquitetura.
- Documentar instalacao, variaveis, comandos e decisoes tecnicas.
- Registrar melhorias futuras.

