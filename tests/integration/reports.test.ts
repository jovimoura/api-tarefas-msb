import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../helpers';
import { testDb, cleanupTestDb } from '../setup';
import { categoryTable, tasksTable } from '../../src/db/schema';

describe('Reports Routes - Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterEach(async () => {
    await cleanupTestDb();
  });

  it('deve retornar relatório vazio quando não há tarefas', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/reports',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.total).toBe(0);
    expect(body.por_status).toEqual([]);
    expect(body.por_categoria).toEqual([]);
    expect(body.por_prioridade).toEqual([]);
  });

  it('deve retornar relatório completo com dados', async () => {
    // Criar categorias
    const [categoria1] = await testDb
      .insert(categoryTable)
      .values({ nome: 'Trabalho', color: '#FF5733' })
      .returning();

    const [categoria2] = await testDb
      .insert(categoryTable)
      .values({ nome: 'Pessoal', color: '#33FF57' })
      .returning();

    // Criar tarefas com diferentes status, prioridades e categorias
    await testDb.insert(tasksTable).values([
      {
        titulo: 'Tarefa 1',
        categoria_id: categoria1.id,
        prioridade: 'urgente',
        status: 'pendente',
        data_criacao: new Date().toISOString(),
      },
      {
        titulo: 'Tarefa 2',
        categoria_id: categoria1.id,
        prioridade: 'alta',
        status: 'em andamento',
        data_criacao: new Date().toISOString(),
      },
      {
        titulo: 'Tarefa 3',
        categoria_id: categoria1.id,
        prioridade: 'média',
        status: 'concluída',
        data_criacao: new Date().toISOString(),
        data_conclusao: new Date().toISOString(),
      },
      {
        titulo: 'Tarefa 4',
        categoria_id: categoria2.id,
        prioridade: 'baixa',
        status: 'pendente',
        data_criacao: new Date().toISOString(),
      },
      {
        titulo: 'Tarefa 5',
        categoria_id: categoria2.id,
        prioridade: 'alta',
        status: 'concluída',
        data_criacao: new Date().toISOString(),
        data_conclusao: new Date().toISOString(),
      },
    ]);

    const response = await app.inject({
      method: 'GET',
      url: '/reports',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);

    expect(body.total).toBe(5);

    // Verificar agregação por status
    expect(body.por_status.length).toBeGreaterThan(0);
    const statusPendente = body.por_status.find((s: any) => s.status === 'pendente');
    expect(statusPendente).toBeDefined();
    expect(statusPendente.quantidade).toBe(2);

    // Verificar agregação por categoria
    expect(body.por_categoria.length).toBe(2);
    const categoriaTrabalho = body.por_categoria.find(
      (c: any) => c.categoria_id === categoria1.id
    );
    expect(categoriaTrabalho).toBeDefined();
    expect(categoriaTrabalho.categoria_nome).toBe('Trabalho');
    expect(categoriaTrabalho.quantidade).toBe(3);

    // Verificar agregação por prioridade
    expect(body.por_prioridade.length).toBeGreaterThan(0);
    const prioridadeUrgente = body.por_prioridade.find((p: any) => p.prioridade === 'urgente');
    expect(prioridadeUrgente).toBeDefined();
    expect(prioridadeUrgente.quantidade).toBe(1);
  });

  it('deve calcular corretamente total de tarefas', async () => {
    const [categoria] = await testDb
      .insert(categoryTable)
      .values({ nome: 'Teste', color: '#FF5733' })
      .returning();

    await testDb.insert(tasksTable).values([
      {
        titulo: 'Tarefa 1',
        categoria_id: categoria.id,
        prioridade: 'alta',
        status: 'pendente',
        data_criacao: new Date().toISOString(),
      },
      {
        titulo: 'Tarefa 2',
        categoria_id: categoria.id,
        prioridade: 'média',
        status: 'concluída',
        data_criacao: new Date().toISOString(),
        data_conclusao: new Date().toISOString(),
      },
    ]);

    const response = await app.inject({
      method: 'GET',
      url: '/reports',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.total).toBe(2);
  });
});
