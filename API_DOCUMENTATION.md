# Documentação da API de Tarefas

## Endpoints

### Categorias

#### Criar categoria
```
POST /categories
Content-Type: application/json

{
  "nome": "Trabalho",
  "color": "#FF5733"
}
```

#### Listar categorias
```
GET /categories
```

#### Buscar categoria por ID
```
GET /categories/:id
```

#### Atualizar categoria
```
PUT /categories/:id
Content-Type: application/json

{
  "nome": "Pessoal",
  "color": "#33FF57"
}
```

#### Excluir categoria
```
DELETE /categories/:id
```

### Tarefas

#### Criar tarefa
```
POST /tasks
Content-Type: application/json

{
  "titulo": "Implementar funcionalidade X",
  "descricao": "Descrição detalhada da tarefa",
  "categoria_id": 1,
  "prioridade": "alta",
  "status": "pendente",
  "data_vencimento": "2024-12-31T23:59:59Z"
}
```

**Valores válidos:**
- `prioridade`: "urgente", "alta", "média", "baixa"
- `status`: "pendente", "em andamento", "concluída", "cancelada"

#### Listar tarefas (com filtros opcionais)
```
GET /tasks?status=pendente&categoria_id=1&prioridade=alta&data_inicio=2024-01-01&data_fim=2024-12-31
```

**Parâmetros de query (todos opcionais):**
- `status`: Filtrar por status
- `categoria_id`: Filtrar por categoria
- `prioridade`: Filtrar por prioridade
- `data_inicio`: Data inicial do intervalo (ISO 8601)
- `data_fim`: Data final do intervalo (ISO 8601)

#### Buscar tarefa por ID
```
GET /tasks/:id
```

#### Atualizar tarefa
```
PUT /tasks/:id
Content-Type: application/json

{
  "titulo": "Título atualizado",
  "status": "em andamento",
  "prioridade": "urgente"
}
```

**Nota:** Todos os campos são opcionais. Apenas os campos enviados serão atualizados.

#### Excluir tarefa
```
DELETE /tasks/:id
```

### Relatórios

#### Relatório agregado
```
GET /reports
```

Retorna:
```json
{
  "total": 10,
  "por_status": [
    { "status": "pendente", "quantidade": 5 },
    { "status": "em andamento", "quantidade": 3 },
    { "status": "concluída", "quantidade": 2 }
  ],
  "por_categoria": [
    {
      "categoria_id": 1,
      "categoria_nome": "Trabalho",
      "categoria_color": "#FF5733",
      "quantidade": 7
    }
  ],
  "por_prioridade": [
    { "prioridade": "alta", "quantidade": 4 },
    { "prioridade": "média", "quantidade": 6 }
  ]
}
```

## Observações

- A API roda na porta `3333` por padrão
- Todas as datas devem estar no formato ISO 8601
- Quando uma tarefa é marcada como "concluída", a `data_conclusao` é preenchida automaticamente
- Quando uma tarefa muda de "concluída" para outro status, a `data_conclusao` é limpa
- A `data_criacao` é preenchida automaticamente ao criar uma tarefa
