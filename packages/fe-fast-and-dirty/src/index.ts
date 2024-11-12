import { WebReact } from "./controllers/web-react";
import { IApp } from "./ports/app";

const main = () => {
  const app: IApp = new WebReact();
  app.run();
};

main();
