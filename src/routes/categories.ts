import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db';
import { categoryTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
} from '../lib/validations';

export async function categoriesRoutes(app: FastifyInstance) {
  app.post(
    '/categories',
    {
      schema: {
        body: createCategorySchema,
      },
    },
    async (request, reply) => {
      const data = request.body as z.infer<typeof createCategorySchema>;

      const novaCategoria = await db
        .insert(categoryTable)
        .values(data)
        .returning();

      return reply.status(201).send(novaCategoria[0]);
    }
  );

  app.get('/categories', async (request, reply) => {
    const categorias = await db.select().from(categoryTable);
    return reply.send(categorias);
  });

  app.get(
    '/categories/:id',
    {
      schema: {
        params: categoryParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof categoryParamsSchema>;

      const categoria = await db
        .select()
        .from(categoryTable)
        .where(eq(categoryTable.id, id))
        .limit(1);

      if (categoria.length === 0) {
        return reply.status(404).send({ error: 'Categoria não encontrada' });
      }

      return reply.send(categoria[0]);
    }
  );

  app.put(
    '/categories/:id',
    {
      schema: {
        params: categoryParamsSchema,
        body: updateCategorySchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof categoryParamsSchema>;
      const data = request.body as z.infer<typeof updateCategorySchema>;
      const { z } = await import('zod');

      const categoriaExistente = await db
        .select()
        .from(categoryTable)
        .where(eq(categoryTable.id, id))
        .limit(1);

      if (categoriaExistente.length === 0) {
        return reply.status(404).send({ error: 'Categoria não encontrada' });
      }

      const categoriaAtualizada = await db
        .update(categoryTable)
        .set(data)
        .where(eq(categoryTable.id, id))
        .returning();

      return reply.send(categoriaAtualizada[0]);
    }
  );

  app.delete(
    '/categories/:id',
    {
      schema: {
        params: categoryParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof categoryParamsSchema>;

      const categoria = await db
        .delete(categoryTable)
        .where(eq(categoryTable.id, id))
        .returning();

      if (categoria.length === 0) {
        return reply.status(404).send({ error: 'Categoria não encontrada' });
      }

      return reply.status(204).send();
    }
  );
}
