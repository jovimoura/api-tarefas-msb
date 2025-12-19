// Este arquivo será gerado automaticamente pelo comando: npx drizzle-kit introspect
// Execute o comando após configurar o DATABASE_URL no arquivo .env
// 
// Para banco SQLite local, use: DATABASE_URL=file:./database.db
// Para Turso (libSQL remoto), use: DATABASE_URL=libsql://... e DATABASE_AUTH_TOKEN=...

import { sqliteTable, text, integer, text as textType } from 'drizzle-orm/sqlite-core';

// As tabelas abaixo são exemplos. Execute 'npx drizzle-kit introspect' 
// para gerar automaticamente o schema baseado no seu banco de dados SQLite
export const tasksTable = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: textType('titulo', { length: 200 }).notNull(),
  descricao: text('descricao'),
  categoria_id: integer('categoria_id').notNull(),
  prioridade: textType('prioridade', { length: 20 }).notNull(),
  status: textType('status', { length: 20 }).notNull(),
  data_criacao: text('data_criacao').notNull(),
  data_vencimento: text('data_vencimento'),
  data_conclusao: text('data_conclusao'),
});

export const categoryTable = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: textType('nome', { length: 200 }).notNull(),
  color: textType('color', { length: 7 }).notNull(),
});
