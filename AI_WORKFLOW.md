# Workflow de Trabalho com IA

Este documento descreve o processo completo de desenvolvimento utilizando assistentes de IA, especificamente o Cursor, para criar projetos de forma estruturada e eficiente.

---

## Visão Geral

O processo de trabalho com IA é dividido em três etapas principais que garantem uma abordagem sistemática desde o planejamento até a implementação final:

1. **Planejamento do Projeto**
2. **Desenvolvimento Inicial**
3. **Desenvolvimento Iterativo com IA**

---

## Etapa 1: Planejamento do Projeto

### Objetivo
Definir as bases do projeto antes de começar a codificação, garantindo uma arquitetura sólida e organizada.

### Atividades

#### 1.1 Escolha de Tecnologias
- Selecionar o stack tecnológico adequado para o projeto
- Considerar requisitos, performance, escalabilidade e experiência da equipe
- Avaliar compatibilidade entre tecnologias escolhidas

#### 1.2 Organização de Estrutura de Pastas
- Definir a arquitetura de diretórios do projeto
- Estabelecer convenções de nomenclatura
- Organizar separação de responsabilidades (ex: `src/`, `tests/`, `config/`, etc.)
- Documentar a estrutura para referência futura

### Resultado Esperado
- Stack tecnológico definido
- Estrutura de pastas criada e documentada
- Base sólida para iniciar o desenvolvimento

---

## Etapa 2: Desenvolvimento Inicial

### Objetivo
Preparar o ambiente e estabelecer as bases técnicas do projeto.

### Atividades

#### 2.1 Instalação de Tecnologias
- Instalar dependências e ferramentas necessárias
- Configurar ambientes de desenvolvimento
- Validar que todas as tecnologias estão funcionando corretamente

#### 2.2 Testagem de Código
- Criar testes iniciais para validar a configuração
- Garantir que o ambiente de testes está funcionando
- Estabelecer padrões de qualidade desde o início

#### 2.3 Entendimento da Tarefa
- Analisar os requisitos da funcionalidade a ser desenvolvida
- Identificar dependências e pré-requisitos
- Mapear possíveis desafios técnicos

### Resultado Esperado
- Ambiente de desenvolvimento configurado e funcional
- Testes básicos passando
- Compreensão clara da tarefa a ser desenvolvida

---

## Etapa 3: Desenvolvimento Iterativo com IA

### Objetivo
Desenvolver funcionalidades de forma incremental utilizando o Cursor, seguindo uma estrutura de prompt padronizada.

### Processo

#### 3.1 Divisão da Tarefa em Etapas
Antes de iniciar a interação com a IA:
- Quebrar a tarefa em etapas menores e gerenciáveis
- Ordenar as etapas de forma lógica (dependências primeiro)
- Priorizar funcionalidades críticas

#### 3.2 Estrutura de Prompt para o Cursor

Seguir esta estrutura padronizada ao interagir com o Cursor:

##### **1. Limpeza de Chat**
```
Limpar o histórico de conversa anterior para começar com contexto limpo.
```
**Por quê:** Evita confusão com contextos de tarefas anteriores e garante foco na tarefa atual.

---

##### **2. Esclarecimento do Projeto**
```
[Explicação do projeto]
[Motivo da existência do projeto]
[Para que serve o projeto]
```
**Exemplo:**
```
Este é um sistema de gerenciamento de tarefas. Foi criado para organizar 
e priorizar atividades diárias. Serve para aumentar a produtividade 
através de um controle eficiente de tarefas e categorias.
```

**Por quê:** Fornece contexto essencial para que a IA entenda o propósito e a arquitetura do projeto.

---

##### **3. Explicação da Feature Desejada**
```
[Descrição detalhada da funcionalidade que deseja desenvolver]
[Comportamento esperado]
[Entradas e saídas]
```
**Exemplo:**
```
Preciso criar um endpoint para listar tarefas filtradas por categoria. 
O endpoint deve receber um parâmetro de categoria e retornar apenas 
as tarefas que pertencem a essa categoria, ordenadas por data de criação.
```

**Por quê:** Define claramente o que precisa ser implementado, evitando mal-entendidos.

---

##### **4. Adicionar Pontos e Observações [OPCIONAL]**
```
[Observações importantes]
[Padrões a seguir]
[Restrições ou requisitos especiais]
```
**Exemplo:**
```
- Seguir a estrutura de pastas existente (src/routes/, src/db/)
- Usar validações do arquivo src/lib/validations.ts
- Manter consistência com o padrão de testes já estabelecido
- Não criar novas dependências sem necessidade
```

**Por quê:** Garante que o código gerado siga os padrões e convenções do projeto.

---

##### **5. FINAL: Validação**
```
Validar se o código está OK e se está seguindo a estrutura e lógica do meu gosto.
```
**Por quê:** Última verificação para garantir qualidade, consistência e aderência aos padrões pessoais de código.

---

### Fluxo Completo de Exemplo

```
1. [Limpar chat]

2. Este é um sistema de gerenciamento de tarefas (API REST). 
   Foi criado para organizar atividades diárias de forma eficiente. 
   Serve para aumentar a produtividade através de um controle 
   centralizado de tarefas e categorias.

3. Preciso criar um endpoint GET /tasks que retorne todas as tarefas 
   com paginação. O endpoint deve aceitar query parameters: 
   `page` (número da página) e `limit` (itens por página).

4. [OPCIONAL]
   - Seguir a estrutura de rotas em src/routes/tasks.ts
   - Usar Drizzle ORM para queries
   - Retornar no formato JSON padrão do projeto
   - Adicionar testes em tests/integration/tasks.test.ts

5. Validar se o código está OK e se está seguindo a estrutura 
   e lógica do meu gosto.
```

---

## Boas Práticas

### ✅ Fazer
- Sempre seguir a estrutura de prompt padronizada
- Dividir tarefas complexas em etapas menores
- Validar o código gerado antes de prosseguir
- Manter o contexto do projeto claro para a IA
- Documentar decisões importantes

### ❌ Evitar
- Pular etapas do processo
- Trabalhar em múltiplas features simultaneamente sem contexto
- Aceitar código sem validação
- Ignorar padrões estabelecidos do projeto
- Misturar contextos de diferentes tarefas no mesmo chat

---

## Checklist de Desenvolvimento

Antes de iniciar uma nova feature:

- [ ] Planejamento completo (tecnologias + estrutura)
- [ ] Ambiente configurado e testado
- [ ] Tarefa dividida em etapas ordenadas
- [ ] Chat limpo no Cursor
- [ ] Contexto do projeto explicado
- [ ] Feature detalhadamente descrita
- [ ] Observações e padrões documentados (se necessário)
- [ ] Código validado e aprovado

---

## Notas Finais

Este workflow foi desenvolvido para maximizar a eficiência e qualidade do código gerado pela IA, mantendo consistência e aderência aos padrões do projeto. A estrutura de prompt padronizada garante que a IA tenha todas as informações necessárias para gerar código alinhado com as expectativas e padrões estabelecidos.

**Última atualização:** [Data]
**Versão:** 1.0
