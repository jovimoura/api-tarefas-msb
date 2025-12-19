# Testes

Este diretório contém os testes unitários e de integração do projeto.

## Estrutura

```
tests/
├── unit/              # Testes unitários
│   └── validations.test.ts
├── integration/       # Testes de integração
│   ├── categories.test.ts
│   ├── tasks.test.ts
│   ├── reports.test.ts
│   └── online.test.ts
├── setup.ts           # Configuração do banco de dados de teste
├── setup-global.ts    # Setup global executado antes de todos os testes
└── helpers.ts         # Funções auxiliares para os testes
```

## Executando os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

## Cobertura

O projeto possui cobertura de código acima de 70% conforme requisito:

- **Statements**: 99.07%
- **Branches**: 95.23%
- **Functions**: 95.45%
- **Lines**: 99.05%

## Configuração

Os testes utilizam:
- **Vitest**: Framework de testes
- **Banco de dados em memória**: SQLite em memória (`:memory:`) para isolamento entre testes
- **Mock do módulo db**: As rotas são testadas usando um banco de dados de teste isolado

## Tipos de Testes

### Testes Unitários
Testam funções e validações isoladamente:
- Validações de schemas Zod
- Transformações de dados
- Validações de entrada

### Testes de Integração
Testam as rotas da API end-to-end:
- Criação, leitura, atualização e exclusão de recursos
- Filtros e consultas
- Relatórios agregados
- Tratamento de erros
