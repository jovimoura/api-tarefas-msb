import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../helpers';
import { testDb, cleanupTestDb } from '../setup';
import { categoryTable } from '../../src/db/schema';

describe('Categories Routes - Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterEach(async () => {
    await cleanupTestDb();
  });

  describe('POST /categories', () => {
    it('deve criar uma categoria com sucesso', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/categories',
        payload: {
          nome: 'Trabalho',
          color: '#FF5733',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.nome).toBe('Trabalho');
      expect(body.color).toBe('#FF5733');
      expect(body.id).toBeDefined();
    });

    it('deve rejeitar categoria com nome vazio', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/categories',
        payload: {
          nome: '',
          color: '#FF5733',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('deve rejeitar categoria com cor inválida', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/categories',
        payload: {
          nome: 'Categoria',
          color: 'FF5733',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /categories', () => {
    it('deve retornar lista vazia quando não há categorias', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/categories',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toEqual([]);
    });

    it('deve retornar todas as categorias', async () => {
      // Criar categorias diretamente no banco
      await testDb.insert(categoryTable).values([
        { nome: 'Trabalho', color: '#FF5733' },
        { nome: 'Pessoal', color: '#33FF57' },
      ]);

      const response = await app.inject({
        method: 'GET',
        url: '/categories',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.length).toBe(2);
      expect(body[0].nome).toBe('Trabalho');
      expect(body[1].nome).toBe('Pessoal');
    });
  });

  describe('GET /categories/:id', () => {
    it('deve retornar categoria por ID', async () => {
      const [categoria] = await testDb
        .insert(categoryTable)
        .values({ nome: 'Trabalho', color: '#FF5733' })
        .returning();

      const response = await app.inject({
        method: 'GET',
        url: `/categories/${categoria.id}`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe(categoria.id);
      expect(body.nome).toBe('Trabalho');
    });

    it('deve retornar 404 para categoria inexistente', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/categories/999',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Categoria não encontrada');
    });
  });

  describe('PUT /categories/:id', () => {
    it('deve atualizar categoria com sucesso', async () => {
      const [categoria] = await testDb
        .insert(categoryTable)
        .values({ nome: 'Trabalho', color: '#FF5733' })
        .returning();

      const response = await app.inject({
        method: 'PUT',
        url: `/categories/${categoria.id}`,
        payload: {
          nome: 'Trabalho Atualizado',
          color: '#00FF00',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.nome).toBe('Trabalho Atualizado');
      expect(body.color).toBe('#00FF00');
    });

    it('deve atualizar apenas nome', async () => {
      const [categoria] = await testDb
        .insert(categoryTable)
        .values({ nome: 'Trabalho', color: '#FF5733' })
        .returning();

      const response = await app.inject({
        method: 'PUT',
        url: `/categories/${categoria.id}`,
        payload: {
          nome: 'Novo Nome',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.nome).toBe('Novo Nome');
      expect(body.color).toBe('#FF5733');
    });

    it('deve retornar 404 para categoria inexistente', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/categories/999',
        payload: {
          nome: 'Novo Nome',
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /categories/:id', () => {
    it('deve deletar categoria com sucesso', async () => {
      const [categoria] = await testDb
        .insert(categoryTable)
        .values({ nome: 'Trabalho', color: '#FF5733' })
        .returning();

      const response = await app.inject({
        method: 'DELETE',
        url: `/categories/${categoria.id}`,
      });

      expect(response.statusCode).toBe(204);

      // Verificar que foi deletada
      const checkResponse = await app.inject({
        method: 'GET',
        url: `/categories/${categoria.id}`,
      });

      expect(checkResponse.statusCode).toBe(404);
    });

    it('deve retornar 404 para categoria inexistente', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/categories/999',
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
