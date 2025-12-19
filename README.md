# API-TAREFAS-MSB

## Tecnologias Utilizadas

- Nodejs
- SQLite
- Fastify
- Drizzle ORM

## Pré-requisitos

### Instalação do Docker

#### Windows
1. Baixe e instale o [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop/)
2. Inicie o Docker Desktop
3. Verifique a instalação:
   ```bash
   docker --version
   docker compose version
   ```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose-plugin

# Ou instale o Docker Desktop
```

#### Mac
1. Baixe e instale o [Docker Desktop para Mac](https://www.docker.com/products/docker-desktop/)
2. Inicie o Docker Desktop

**Nota:** O Docker Compose V2 (versão mais recente) usa `docker compose` (sem hífen). Se você tiver a versão antiga, use `docker-compose` (com hífen).

## Como Executar

### Opção 1: Usando Docker (Recomendado)

#### 1. Clone o repositório

```bash
git clone [url]
cd api-tarefas-msb
```

#### 2. Configure as variáveis de ambiente

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

Edite o arquivo `.env` se necessário (a configuração padrão já funciona para SQLite local).

#### 3. Suba os containers

**Docker Compose V2 (recomendado):**
```bash
docker compose up -d
```

**Docker Compose V1 (versão antiga):**
```bash
docker-compose up -d
```

Para ver os logs:
```bash
# Docker Compose V2
docker compose logs -f

# Docker Compose V1
docker-compose logs -f
```

#### 4. Acesse a documentação da API

```
http://localhost:3333/docs
```

#### 5. Parar os containers

```bash
# Docker Compose V2
docker compose down

# Docker Compose V1
docker-compose down
```

### Opção 2: Execução Local (Desenvolvimento)

#### 1. Instale as dependências

```bash
npm install
```

#### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

#### 3. Execute a aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3333`

## Troubleshooting

### Erro: "docker-compose: command not found"

Se você receber este erro, tente:

1. **Verificar se o Docker está instalado:**
   ```bash
   docker --version
   ```

2. **Usar a sintaxe do Docker Compose V2:**
   ```bash
   docker compose up -d
   ```
   (Note: sem hífen entre `docker` e `compose`)

3. **Se ainda não funcionar, instale o Docker Desktop:**
   - Windows: [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop/)
   - Mac: [Docker Desktop para Mac](https://www.docker.com/products/docker-desktop/)
   - Linux: Siga as instruções de instalação do Docker para sua distribuição

### Erro: "Cannot connect to the Docker daemon"

Certifique-se de que o Docker Desktop está rodando. No Windows/Mac, abra o Docker Desktop e aguarde até que ele esteja totalmente iniciado.

### Porta 3333 já está em uso

Se a porta 3333 já estiver em uso, você pode alterar a porta no `docker-compose.yml`:

```yaml
ports:
  - "3334:3333"  # Altere 3334 para a porta desejada
```

## Como Executar os Testes

```
[Comandos para rodar os testes]
```

## Estrutura do Projeto

```bash
api-tarefas-msb/
├── src/               # Código fonte da aplicação
│   ├── routes/        # Definição das rotas Fastify
│   │   ├── categories.ts
│   │   ├── online.ts
│   │   ├── reports.ts
│   │   └── tasks.ts
│   ├── db/            # Schema e configuração do banco (Drizzle ORM)
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── lib/           # Funções utilitárias e helpers
│   │   └── validations.ts
│   └── index.ts       # Ponto de entrada do app
├── drizzle/           # Migrations e schema do Drizzle ORM
│   ├── meta/
│   └── *.sql          # Arquivos de migração
├── tests/             # Testes automatizados
│   ├── integration/   # Testes de integração das rotas
│   │   ├── categories.test.ts
│   │   ├── online.test.ts
│   │   ├── reports.test.ts
│   │   └── tasks.test.ts
│   ├── unit/          # Testes unitários dos módulos
│   │   └── validations.test.ts
│   ├── helpers.ts     # Funções auxiliares para testes
│   ├── setup.ts       # Configuração dos testes
│   ├── setup-global.ts
│   └── README.md
├── docker-compose.yml # Configuração dos containers
├── Dockerfile         # Build da imagem da API
├── drizzle.config.ts  # Configuração do Drizzle ORM
├── vitest.config.ts   # Configuração do Vitest
├── package.json       # Dependências do projeto
├── .env.example       # Exemplo de variáveis de ambiente
├── README.md          # Instruções de execução e uso
├── API_DOCUMENTATION.md # Documentação da API
├── DEV-WORKFLOW.md    # Configuração do fluxo com IA
├── AI_WORKFLOW.md     # Registro do processo IA
└── CLAUDE.md          # Contexto para Claude Code
```

## Decisões Técnicas

[Justificativas das escolhas de arquitetura]

## Documentação de IA

- [DEV-WORKFLOW.md](./DEV-WORKFLOW.md) - Configuração do fluxo de desenvolvimento
- [AI_WORKFLOW.md](./AI_WORKFLOW.md) - Registro do processo de desenvolvimento