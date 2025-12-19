import { FastifyInstance } from 'fastify';
import { db } from '../db';
import { tasksTable, categoryTable } from '../db/schema';
import { sql, eq } from 'drizzle-orm';

export async function reportsRoutes(app: FastifyInstance) {
  app.get('/reports', async (request, reply) => {
    const porStatus = await db
      .select({
        status: tasksTable.status,
        quantidade: sql<number>`count(*)`.as('quantidade'),
      })
      .from(tasksTable)
      .groupBy(tasksTable.status);

    const porCategoria = await db
      .select({
        categoria_id: tasksTable.categoria_id,
        categoria_nome: categoryTable.nome,
        categoria_color: categoryTable.color,
        quantidade: sql<number>`count(*)`.as('quantidade'),
      })
      .from(tasksTable)
      .leftJoin(categoryTable, eq(tasksTable.categoria_id, categoryTable.id))
      .groupBy(tasksTable.categoria_id, categoryTable.nome, categoryTable.color);

    const porPrioridade = await db
      .select({
        prioridade: tasksTable.prioridade,
        quantidade: sql<number>`count(*)`.as('quantidade'),
      })
      .from(tasksTable)
      .groupBy(tasksTable.prioridade);

    const total = await db
      .select({
        total: sql<number>`count(*)`.as('total'),
      })
      .from(tasksTable);

    return reply.send({
      total: total[0]?.total || 0,
      por_status: porStatus,
      por_categoria: porCategoria,
      por_prioridade: porPrioridade,
    });
  });
}
