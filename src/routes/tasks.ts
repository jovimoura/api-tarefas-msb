import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db';
import { tasksTable, categoryTable } from '../db/schema';
import { eq, and, gte, lte, sql, SQL } from 'drizzle-orm';
import {
  createTaskSchema,
  updateTaskSchema,
  taskParamsSchema,
  taskQuerySchema,
} from '../lib/validations';

export async function tasksRoutes(app: FastifyInstance) {
  app.post(
    '/tasks',
    {
      schema: {
        body: createTaskSchema,
      },
    },
    async (request, reply) => {
      const data = request.body as z.infer<typeof createTaskSchema>;

      const categoria = await db
        .select()
        .from(categoryTable)
        .where(eq(categoryTable.id, data.categoria_id))
        .limit(1);

      if (categoria.length === 0) {
        return reply.status(404).send({ error: 'Categoria não encontrada' });
      }

      const novaTarefa = await db
        .insert(tasksTable)
        .values({
          ...data,
          data_criacao: new Date().toISOString(),
          data_conclusao: data.status === 'concluída' ? new Date().toISOString() : null,
        })
        .returning();

      return reply.status(201).send(novaTarefa[0]);
    }
  );

  app.get(
    '/tasks',
    {
      schema: {
        querystring: taskQuerySchema,
      },
    },
    async (request, reply) => {
      const query = request.query as z.infer<typeof taskQuerySchema>;

      const conditions: ReturnType<typeof eq>[] = [];

      if (query.status) {
        conditions.push(eq(tasksTable.status, query.status));
      }

      if (query.categoria_id) {
        conditions.push(eq(tasksTable.categoria_id, query.categoria_id));
      }

      if (query.prioridade) {
        conditions.push(eq(tasksTable.prioridade, query.prioridade));
      }

      if (query.data_inicio) {
        conditions.push(gte(tasksTable.data_criacao, query.data_inicio));
      }

      if (query.data_fim) {
        conditions.push(lte(tasksTable.data_criacao, query.data_fim));
      }

      const queryBuilder = db
        .select({
          id: tasksTable.id,
          titulo: tasksTable.titulo,
          descricao: tasksTable.descricao,
          categoria_id: tasksTable.categoria_id,
          categoria: {
            id: categoryTable.id,
            nome: categoryTable.nome,
            color: categoryTable.color,
          },
          prioridade: tasksTable.prioridade,
          status: tasksTable.status,
          data_criacao: tasksTable.data_criacao,
          data_vencimento: tasksTable.data_vencimento,
          data_conclusao: tasksTable.data_conclusao,
        })
        .from(tasksTable)
        .leftJoin(categoryTable, eq(tasksTable.categoria_id, categoryTable.id));

      const tarefas = conditions.length > 0
        ? await queryBuilder.where(and(...conditions))
        : await queryBuilder;

      return reply.send(tarefas);
    }
  );

  app.get(
    '/tasks/:id',
    {
      schema: {
        params: taskParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof taskParamsSchema>;

      const tarefa = await db
        .select({
          id: tasksTable.id,
          titulo: tasksTable.titulo,
          descricao: tasksTable.descricao,
          categoria_id: tasksTable.categoria_id,
          categoria: {
            id: categoryTable.id,
            nome: categoryTable.nome,
            color: categoryTable.color,
          },
          prioridade: tasksTable.prioridade,
          status: tasksTable.status,
          data_criacao: tasksTable.data_criacao,
          data_vencimento: tasksTable.data_vencimento,
          data_conclusao: tasksTable.data_conclusao,
        })
        .from(tasksTable)
        .leftJoin(categoryTable, eq(tasksTable.categoria_id, categoryTable.id))
        .where(eq(tasksTable.id, id))
        .limit(1);

      if (tarefa.length === 0) {
        return reply.status(404).send({ error: 'Tarefa não encontrada' });
      }

      return reply.send(tarefa[0]);
    }
  );

  app.put(
    '/tasks/:id',
    {
      schema: {
        params: taskParamsSchema,
        body: updateTaskSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof taskParamsSchema>;
      const data = request.body as z.infer<typeof updateTaskSchema>;

      const tarefaExistente = await db
        .select()
        .from(tasksTable)
        .where(eq(tasksTable.id, id))
        .limit(1);

      if (tarefaExistente.length === 0) {
        return reply.status(404).send({ error: 'Tarefa não encontrada' });
      }

      if (data.categoria_id) {
        const categoria = await db
          .select()
          .from(categoryTable)
          .where(eq(categoryTable.id, data.categoria_id))
          .limit(1);

        if (categoria.length === 0) {
          return reply.status(404).send({ error: 'Categoria não encontrada' });
        }
      }

      const updateData: any = { ...data };
      if (data.status === 'concluída' && tarefaExistente[0].status !== 'concluída') {
        updateData.data_conclusao = new Date().toISOString();
      } else if (data.status !== 'concluída' && data.status !== undefined) {
        updateData.data_conclusao = null;
      }

      const tarefaAtualizada = await db
        .update(tasksTable)
        .set(updateData)
        .where(eq(tasksTable.id, id))
        .returning();

      return reply.send(tarefaAtualizada[0]);
    }
  );

  app.delete(
    '/tasks/:id',
    {
      schema: {
        params: taskParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof taskParamsSchema>;

      const tarefa = await db
        .delete(tasksTable)
        .where(eq(tasksTable.id, id))
        .returning();

      if (tarefa.length === 0) {
        return reply.status(404).send({ error: 'Tarefa não encontrada' });
      }

      return reply.status(204).send();
    }
  );
}
