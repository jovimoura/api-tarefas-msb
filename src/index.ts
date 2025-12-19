import 'dotenv/config';

import { fastify } from "fastify";
import cors from "@fastify/cors";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { tasksRoutes } from "./routes/tasks";
import { categoriesRoutes } from "./routes/categories";
import { reportsRoutes } from "./routes/reports";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
  origin: "*",
});

app.register(tasksRoutes);
app.register(categoriesRoutes);
app.register(reportsRoutes);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP server running on http://localhost:3333");
  });