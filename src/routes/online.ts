import { FastifyInstance } from "fastify";

export async function onlineRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const message = {
      message: "API Online",
    }

    return message;
  });
}