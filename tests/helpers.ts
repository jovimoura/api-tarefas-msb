import { vi } from 'vitest';
import { fastify } from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { getTestDb } from './setup';

// Mockar o módulo db antes de importar as rotas
// Usar factory function para evitar problemas de inicialização
vi.mock('../src/db', () => {
  return {
    db: getTestDb(),
  };
});

import { tasksRoutes } from '../src/routes/tasks';
import { categoriesRoutes } from '../src/routes/categories';
import { reportsRoutes } from '../src/routes/reports';
import { onlineRoutes } from '../src/routes/online';

export async function buildApp() {
  const app = fastify();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(cors, {
    origin: '*',
  });

  app.register(tasksRoutes);
  app.register(categoriesRoutes);
  app.register(reportsRoutes);
  app.register(onlineRoutes);

  return app;
}
