import * as React from "react";
import { createRoot } from "react-dom/client";
import { IAuthenticate } from "../../ports/authenticate";
import { SchoolConsultant } from "./app";
import { ICheckIfAuthenticated } from "../../ports/check-if-authenticated";
import { IGetUser } from "../../ports/get-user";
import { IAddChild } from "../../ports/add-child";
import { IGetChild } from "../../ports/get-child";
import { ISaveRecommendation } from "../../ports/save-recommendation";
import {IGetRecommendation} from "../../ports/get-recommendation";

export const main = (
  checkAuthInterval: number,
  authenticateUsecase: IAuthenticate,
  checkAuthUsecase: ICheckIfAuthenticated,
  getUserUsecase: IGetUser,
  addChildUsecase: IAddChild,
  getChildUsecase: IGetChild,
  saveRecommendation: ISaveRecommendation,
  getRecommendation: IGetRecommendation,
) => {
  const root = createRoot(document.getElementById("root"));
  root.render(
    <SchoolConsultant
      checkAuthInterval={checkAuthInterval}
      auth={authenticateUsecase}
      checkAuth={checkAuthUsecase}
      getUser={getUserUsecase}
      addChild={addChildUsecase}
      getChild={getChildUsecase}
      saveRecommendation={saveRecommendation}
      getRecommendation={getRecommendation}
    ></SchoolConsultant>,
  );
};
