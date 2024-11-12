import fastify, { FastifyInstance } from "fastify";
import { IApp } from "../ports/app";

export class FastifyWebServer implements IApp {
  private server: FastifyInstance;

  public constructor() {
    this.server = fastify();

    this.server.get("/health", async (request, reply) => {
      console.log(request.headers);
      reply.statusCode = 200;
      reply.send("ok");
    });
  }

  public run() {
    this.server.listen({ port: 8080 }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  }
}
