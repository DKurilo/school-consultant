import * as React from "react";
import { createRoot } from "react-dom/client";
import { IAuthenticate } from "../../ports/authenticate";
import { SchoolConsultant } from "./app";
import { ICheckIfAuthenticated } from "../../ports/check-if-authenticated";
import { IGetUser } from "../../ports/get-user";
import { IAddChild } from "../../ports/add-child";
import { IGetChild } from "../../ports/get-child";
import { ISaveRecommendation } from "../../ports/save-recommendation";
import { IGetRecommendation } from "../../ports/get-recommendation";
import { IBuildRecommendation } from "../../ports/build-recommendation";
import { IGetRoRecommendation } from "../../ports/get-ro-recommendation";
import { SchoolConsultantRo } from "./app_ro";

export const main = (
  googleApiKey: string,
  checkAuthInterval: number,
  authenticateUsecase: IAuthenticate,
  checkAuthUsecase: ICheckIfAuthenticated,
  getUserUsecase: IGetUser,
  addChildUsecase: IAddChild,
  getChildUsecase: IGetChild,
  saveRecommendation: ISaveRecommendation,
  getRecommendation: IGetRecommendation,
  buildRecommendation: IBuildRecommendation,
  baseUrl: string,
) => {
  const root = createRoot(document.getElementById("root"));
  root.render(
    <SchoolConsultant
      googleApiKey={googleApiKey}
      checkAuthInterval={checkAuthInterval}
      auth={authenticateUsecase}
      checkAuth={checkAuthUsecase}
      getUser={getUserUsecase}
      addChild={addChildUsecase}
      getChild={getChildUsecase}
      saveRecommendation={saveRecommendation}
      getRecommendation={getRecommendation}
      buildRecommendation={buildRecommendation}
      baseUrl={baseUrl}
    ></SchoolConsultant>,
  );
};

export const mainRo = (
  googleApiKey: string,
  getRoRecommendation: IGetRoRecommendation,
  roToken: string,
) => {
  const root = createRoot(document.getElementById("root"));
  root.render(
    <SchoolConsultantRo
      googleApiKey={googleApiKey}
      getRoRecommendation={getRoRecommendation}
      roToken={roToken}
    />,
  );
};
