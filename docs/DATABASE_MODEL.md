# Modelagem do banco

## Entidades

### users

Armazena usuarios autenticaveis.

Campos principais:

- `id`: UUID primario.
- `name`: nome obrigatorio.
- `email`: unico, usado no login.
- `password_hash`: hash bcrypt da senha.
- `created_at` e `updated_at`: auditoria basica.

Relacionamentos:

- Um usuario possui muitas tarefas.
- Ao excluir um usuario, suas tarefas sao excluidas em cascata.

### tasks

Armazena tarefas pertencentes a um unico usuario.

Campos principais:

- `id`: UUID primario.
- `title`: titulo obrigatorio.
- `description`: texto opcional.
- `status`: `PENDING`, `IN_PROGRESS` ou `COMPLETED`.
- `priority`: `LOW`, `MEDIUM` ou `HIGH`.
- `responsible`: responsavel opcional.
- `due_date`: data limite obrigatoria.
- `user_id`: dono da tarefa.
- `created_at` e `updated_at`: auditoria basica.

Indices:

- `user_id + status`
- `user_id + priority`
- `user_id + due_date`

Esses indices favorecem listagem, filtros e dashboard por usuario.

### task_history

Armazena alteracoes relevantes de uma tarefa.

Campos principais:

- `id`: UUID primario.
- `task_id`: tarefa relacionada.
- `action`: tipo da alteracao.
- `old_value`: valor anterior.
- `new_value`: novo valor.
- `created_at`: momento da alteracao.

Acoes:

- `STATUS_CHANGED`
- `PRIORITY_CHANGED`
- `RESPONSIBLE_CHANGED`
- `DUE_DATE_CHANGED`

O acesso ao historico sera autorizado pela tarefa relacionada: uma consulta so retorna historico quando `tasks.user_id` for igual ao usuario autenticado.
