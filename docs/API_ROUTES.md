# Estrutura de rotas

Base URL: `/api`

## Health

| Metodo | Rota      | Protegida | Descricao                       |
| ------ | --------- | --------- | ------------------------------- |
| GET    | `/health` | Nao       | Verifica disponibilidade da API |

## Auth

| Metodo | Rota                 | Protegida | Controller                | Service                |
| ------ | -------------------- | --------- | ------------------------- | ---------------------- |
| POST   | `/api/auth/register` | Nao       | `AuthController.register` | `AuthService.register` |
| POST   | `/api/auth/login`    | Nao       | `AuthController.login`    | `AuthService.login`    |
| POST   | `/api/auth/logout`   | Sim       | `AuthController.logout`   | `AuthService.logout`   |

## Tasks

| Metodo | Rota                     | Protegida | Controller                | Service                |
| ------ | ------------------------ | --------- | ------------------------- | ---------------------- |
| GET    | `/api/tasks`             | Sim       | `TaskController.list`     | `TaskService.list`     |
| POST   | `/api/tasks`             | Sim       | `TaskController.create`   | `TaskService.create`   |
| GET    | `/api/tasks/:id`         | Sim       | `TaskController.findById` | `TaskService.findById` |
| PUT    | `/api/tasks/:id`         | Sim       | `TaskController.update`   | `TaskService.update`   |
| DELETE | `/api/tasks/:id`         | Sim       | `TaskController.remove`   | `TaskService.remove`   |
| GET    | `/api/tasks/:id/history` | Sim       | `TaskController.history`  | `TaskService.history`  |

Filtros combinaveis em `GET /api/tasks`:

- `status`
- `priority`
- `responsible`
- `dueDate`
- `search`

Exemplo:

```text
/api/tasks?status=PENDING&priority=HIGH&search=projeto
```

## Dashboard

| Metodo | Rota             | Protegida | Controller                    | Service                    |
| ------ | ---------------- | --------- | ----------------------------- | -------------------------- |
| GET    | `/api/dashboard` | Sim       | `DashboardController.summary` | `DashboardService.summary` |

Indicadores:

- tarefas pendentes;
- tarefas concluidas;
- tarefas atrasadas: `dueDate < hoje` e `status != COMPLETED`.
