import * as React from "react";
import { createRoot } from "react-dom/client";
import { IAuthenticate } from "../../ports/authenticate";
import { SchoolConsultant } from "./app";
import { ICheckIfAuthenticated } from "../../ports/check-if-authenticated";

export const main = (
  checkAuthInterval: number,
  authenticateUsecase: IAuthenticate,
  checkAuth: ICheckIfAuthenticated,
) => {
  const root = createRoot(document.getElementById("root"));
  root.render(
    <SchoolConsultant
      checkAuthInterval={checkAuthInterval}
      auth={authenticateUsecase}
      checkAuth={checkAuth}
    ></SchoolConsultant>,
  );
};
