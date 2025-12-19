import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const categoryTable = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome', { length: 200 }).notNull(),
  color: text('color', { length: 7 }).notNull(),
});

export const tasksTable = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo', { length: 200 }).notNull(),
  descricao: text('descricao'),
  categoria_id: integer('categoria_id').notNull().references(() => categoryTable.id),
  prioridade: text('prioridade', { length: 20 }).notNull(), // urgente, alta, média, baixa
  status: text('status', { length: 20 }).notNull(), // pendente, em andamento, concluída, cancelada
  data_criacao: text('data_criacao').notNull(),
  data_vencimento: text('data_vencimento'),
  data_conclusao: text('data_conclusao'),
});

export const categoriesRelations = relations(categoryTable, ({ many }) => ({
  tasks: many(tasksTable),
}));

export const tasksRelations = relations(tasksTable, ({ one }) => ({
  categoria: one(categoryTable, {
    fields: [tasksTable.categoria_id],
    references: [categoryTable.id],
  }),
}));
