import { createRoot } from "react-dom/client";
import { IApp } from "../ports/app";
import { MyApp } from "./react";

export class WebReact implements IApp {
  public run(): void {
    const root = createRoot(document.getElementById("root"));
    root.render(MyApp());
  }
}
