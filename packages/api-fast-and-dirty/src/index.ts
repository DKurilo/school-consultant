import { FastifyWebServer } from "./controllers/fastify-web-server";
import { IApp } from "./ports/app";

const main = () => {
  const app: IApp = new FastifyWebServer();
  app.run();
};

main();
