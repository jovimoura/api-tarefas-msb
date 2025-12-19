import 'dotenv/config';

import { fastify } from "fastify";
import cors from "@fastify/cors";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { tasksRoutes } from "./routes/tasks";
import { categoriesRoutes } from "./routes/categories";
import { reportsRoutes } from "./routes/reports";
import { onlineRoutes } from "./routes/online";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
  origin: "*",
});

app.register(tasksRoutes);
app.register(categoriesRoutes);
app.register(reportsRoutes);
app.register(onlineRoutes);

const port = Number(process.env.PORT) || 3333;

app
  .listen({
    port,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`HTTP server running on http://0.0.0.0:${port}`);
  });