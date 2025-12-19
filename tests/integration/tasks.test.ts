import { describe, it, expect, beforeAll, afterEach, beforeEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../helpers';
import { testDb, cleanupTestDb } from '../setup';
import { categoryTable, tasksTable } from '../../src/db/schema';

describe('Tasks Routes - Integration Tests', () => {
  let app: FastifyInstance;
  let categoriaId: number;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterEach(async () => {
    await cleanupTestDb();
  });

  beforeEach(async () => {
    // Criar categoria para usar nos testes
    const [categoria] = await testDb
      .insert(categoryTable)
      .values({ nome: 'Teste', color: '#FF5733' })
      .returning();
    categoriaId = categoria.id;
  });

  beforeEach(async () => {
    // Criar categoria para usar nos testes
    const [categoria] = await testDb
      .insert(categoryTable)
      .values({ nome: 'Teste', color: '#FF5733' })
      .returning();
    categoriaId = categoria.id;
  });

  describe('POST /tasks', () => {
    it('deve criar uma tarefa com sucesso', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          titulo: 'Nova Tarefa',
          descricao: 'Descrição da tarefa',
          categoria_id: categoriaId,
          prioridade: 'alta',
          status: 'pendente',
          data_vencimento: '2024-12-31T23:59:59Z',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.titulo).toBe('Nova Tarefa');
      expect(body.categoria_id).toBe(categoriaId);
      expect(body.data_criacao).toBeDefined();
      expect(body.data_conclusao).toBeNull();
    });

    it('deve definir data_conclusao quando status é concluída', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          titulo: 'Tarefa Concluída',
          categoria_id: categoriaId,
          prioridade: 'média',
          status: 'concluída',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('concluída');
      expect(body.data_conclusao).toBeDefined();
    });

    it('deve rejeitar tarefa com categoria inexistente', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          titulo: 'Tarefa',
          categoria_id: 999,
          prioridade: 'alta',
          status: 'pendente',
        },
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Categoria não encontrada');
    });

    it('deve rejeitar tarefa sem título', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          categoria_id: categoriaId,
          prioridade: 'alta',
          status: 'pendente',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /tasks', () => {
    it('deve retornar lista vazia quando não há tarefas', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/tasks',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toEqual([]);
    });

    it('deve retornar todas as tarefas', async () => {
      await testDb.insert(tasksTable).values([
        {
          titulo: 'Tarefa 1',
          categoria_id: categoriaId,
          prioridade: 'alta',
          status: 'pendente',
          data_criacao: new Date().toISOString(),
        },
        {
          titulo: 'Tarefa 2',
          categoria_id: categoriaId,
          prioridade: 'média',
          status: 'em andamento',
          data_criacao: new Date().toISOString(),
        },
      ]);

      const response = await app.inject({
        method: 'GET',
        url: '/tasks',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.length).toBe(2);
      expect(body[0].categoria).toBeDefined();
    });

    it('deve filtrar tarefas por status', async () => {
      await testDb.insert(tasksTable).values([
        {
          titulo: 'Tarefa Pendente',
          categoria_id: categoriaId,
          prioridade: 'alta',
          status: 'pendente',
          data_criacao: new Date().toISOString(),
        },
        {
          titulo: 'Tarefa Concluída',
          categoria_id: categoriaId,
          prioridade: 'média',
          status: 'concluída',
          data_criacao: new Date().toISOString(),
        },
      ]);

      const response = await app.inject({
        method: 'GET',
        url: '/tasks?status=pendente',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.length).toBe(1);
      expect(body[0].status).toBe('pendente');
    });

    it('deve filtrar tarefas por categoria_id', async () => {
      const [categoria2] = await testDb
        .insert(categoryTable)
        .values({ nome: 'Categoria 2', color: '#00FF00' })
        .returning();

      await testDb.insert(tasksTable).values([
        {
          titulo: 'Tarefa 1',
          categoria_id: categoriaId,
          prioridade: 'alta',
          status: 'pendente',
          data_criacao: new Date().toISOString(),
        },
        {
          titulo: 'Tarefa 2',
          categoria_id: categoria2.id,
          prioridade: 'média',
          status: 'pendente',
          data_criacao: new Date().toISOString(),
        },
      ]);

      const response = await app.inject({
        method: 'GET',
        url: `/tasks?categoria_id=${categoriaId}`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.length).toBe(1);
      expect(body[0].categoria_id).toBe(categoriaId);
    });

    it('deve filtrar tarefas por prioridade', async () => {
      await testDb.insert(tasksTable).values([
        {
          titulo: 'Tarefa Urgente',
          categoria_id: categoriaId,
          prioridade: 'urgente',
          status: 'pendente',
          data_criacao: new Date().toISOString(),
        },
        {
          titulo: 'Tarefa Baixa',
          categoria_id: categoriaId,
          prioridade: 'baixa',
          status: 'pendente',
          data_criacao: new Date().toISOString(),
        },
      ]);

      const response = await app.inject({
        method: 'GET',
        url: '/tasks?prioridade=urgente',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.length).toBe(1);
      expect(body[0].prioridade).toBe('urgente');
    });

    it('deve filtrar tarefas por data_inicio e data_fim', async () => {
      const dataInicio = '2024-01-01T00:00:00Z';
      const dataFim = '2024-12-31T23:59:59Z';

      await testDb.insert(tasksTable).values([
        {
          titulo: 'Tarefa 1',
          categoria_id: categoriaId,
          prioridade: 'alta',
          status: 'pendente',
          data_criacao: '2024-06-15T00:00:00Z',
        },
        {
          titulo: 'Tarefa 2',
          categoria_id: categoriaId,
          prioridade: 'média',
          status: 'pendente',
          data_criacao: '2025-01-15T00:00:00Z',
        },
      ]);

      const response = await app.inject({
        method: 'GET',
        url: `/tasks?data_inicio=${dataInicio}&data_fim=${dataFim}`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.length).toBe(1);
      expect(body[0].titulo).toBe('Tarefa 1');
    });
  });

  describe('GET /tasks/:id', () => {
    it('deve retornar tarefa por ID', async () => {
      const [tarefa] = await testDb
        .insert(tasksTable)
        .values({
          titulo: 'Tarefa Teste',
          categoria_id: categoriaId,
          prioridade: 'alta',
          status: 'pendente',
          data_criacao: new Date().toISOString(),
        })
        .returning();

      const response = await app.inject({
        method: 'GET',
        url: `/tasks/${tarefa.id}`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe(tarefa.id);
      expect(body.titulo).toBe('Tarefa Teste');
      expect(body.categoria).toBeDefined();
    });

    it('deve retornar 404 para tarefa inexistente', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/tasks/999',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Tarefa não encontrada');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('deve atualizar tarefa com sucesso', async () => {
      const [tarefa] = await testDb
        .insert(tasksTable)
        .values({
          titulo: 'Tarefa Original',
          categoria_id: categoriaId,
          prioridade: 'alta',
          status: 'pendente',
          data_criacao: new Date().toISOString(),
        })
        .returning();

      const response = await app.inject({
        method: 'PUT',
        url: `/tasks/${tarefa.id}`,
        payload: {
          titulo: 'Tarefa Atualizada',
          status: 'em andamento',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.titulo).toBe('Tarefa Atualizada');
      expect(body.status).toBe('em andamento');
    });

    it('deve definir data_conclusao ao marcar como concluída', async () => {
      const [tarefa] = await testDb
        .insert(tasksTable)
        .values({
          titulo: 'Tarefa',
          categoria_id: categoriaId,
          prioridade: 'alta',
          status: 'pendente',
          data_criacao: new Date().toISOString(),
        })
        .returning();

      const response = await app.inject({
        method: 'PUT',
        url: `/tasks/${tarefa.id}`,
        payload: {
          status: 'concluída',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('concluída');
      expect(body.data_conclusao).toBeDefined();
    });

    it('deve limpar data_conclusao ao mudar de concluída para outro status', async () => {
      const [tarefa] = await testDb
        .insert(tasksTable)
        .values({
          titulo: 'Tarefa',
          categoria_id: categoriaId,
          prioridade: 'alta',
          status: 'concluída',
          data_criacao: new Date().toISOString(),
          data_conclusao: new Date().toISOString(),
        })
        .returning();

      const response = await app.inject({
        method: 'PUT',
        url: `/tasks/${tarefa.id}`,
        payload: {
          status: 'pendente',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('pendente');
      expect(body.data_conclusao).toBeNull();
    });

    it('deve rejeitar atualização com categoria inexistente', async () => {
      const [tarefa] = await testDb
        .insert(tasksTable)
        .values({
          titulo: 'Tarefa',
          categoria_id: categoriaId,
          prioridade: 'alta',
          status: 'pendente',
          data_criacao: new Date().toISOString(),
        })
        .returning();

      const response = await app.inject({
        method: 'PUT',
        url: `/tasks/${tarefa.id}`,
        payload: {
          categoria_id: 999,
        },
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Categoria não encontrada');
    });

    it('deve retornar 404 para tarefa inexistente', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/tasks/999',
        payload: {
          titulo: 'Nova Tarefa',
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('deve deletar tarefa com sucesso', async () => {
      const [tarefa] = await testDb
        .insert(tasksTable)
        .values({
          titulo: 'Tarefa para Deletar',
          categoria_id: categoriaId,
          prioridade: 'alta',
          status: 'pendente',
          data_criacao: new Date().toISOString(),
        })
        .returning();

      const response = await app.inject({
        method: 'DELETE',
        url: `/tasks/${tarefa.id}`,
      });

      expect(response.statusCode).toBe(204);

      // Verificar que foi deletada
      const checkResponse = await app.inject({
        method: 'GET',
        url: `/tasks/${tarefa.id}`,
      });

      expect(checkResponse.statusCode).toBe(404);
    });

    it('deve retornar 404 para tarefa inexistente', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/tasks/999',
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
