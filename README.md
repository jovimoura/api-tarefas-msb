# API-TAREFAS-MSB

## Tecnologias Utilizadas

- Nodejs
- SQLite
- Fastify
- Drizzle ORM

## Pré-requisitos
- Docker e Docker Compose instalados

## Como Executar

### 1. Clone o repositório

```
git clone [url]
```

```
cd [pasta]
```

### 2. Configure as variáveis de ambiente

```
cp .env.example .env
```

### 3. Suba os containers

```
docker-compose up -d
```

### 4. Acesse a documentação da API

```
http://localhost:[porta]/docs
```

## Como Executar os Testes

```
[Comandos para rodar os testes]
```

## Estrutura do Projeto

```bash
projeto-teste/
├── src/ # Código fonte da aplicação
│ ├── controllers/ # ou equivalente na stack escolhida
│ ├── models/
│ ├── services/
│ └── ...
├── tests/ # Testes automatizados
│ ├── unit/
│ └── integration/
├── docs/ # Documentação OpenAPI/Swagger
├── docker-compose.yml # Containerização completa
├── Dockerfile
├── README.md # Instruções de execução
├── DEV-WORKFLOW.md # [OBRIGATÓRIO] Configuração do fluxo com IA
├── AI_WORKFLOW.md # [OBRIGATÓRIO] Registro do processo
├── CLAUDE.md # [OBRIGATÓRIO] Contexto do projeto para Claude
└── .claude/ # [DIFERENCIAL] Configurações do Claude Code
└── settings.json # MCPs e configurações
```

## Decisões Técnicas

[Justificativas das escolhas de arquitetura]

## Documentação de IA

- [DEV-WORKFLOW.md](./DEV-WORKFLOW.md) - Configuração do fluxo de desenvolvimento
- [AI_WORKFLOW.md](./AI_WORKFLOW.md) - Registro do processo de desenvolvimento