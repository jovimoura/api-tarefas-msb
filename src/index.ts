import 'dotenv/config';

import { fastify } from "fastify";
import cors from "@fastify/cors";

const app = fastify();

app.register(cors, {
  origin: "*",
});

// app.register(postSignIn);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP server running!");
  });