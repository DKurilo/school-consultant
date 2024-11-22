import * as React from "react";
import { IGetUser } from "../../../ports/get-user";
import { UserPage } from "./user-page";
import { IAddChild } from "../../../ports/add-child";
import { IGetChild } from "../../../ports/get-child";
import { ChildPage } from "./child-page";
import { ISaveRecommendation } from "../../../ports/save-recommendation";
import { EditRecommendationPage } from "./edit-recommendation-page";
import { IGetRecommendation } from "../../../ports/get-recommendation";

export type PageParams = {
  getUser: IGetUser;
  addChild: IAddChild;
  getChild: IGetChild;
  saveRecommendation: ISaveRecommendation;
  getRecommendation: IGetRecommendation;
};

export const Page = (params: PageParams) => {
  const [currentPage, setCurrentPage] = React.useState<(string | undefined)[]>([
    "user",
  ]);

  const userPageChildCallback = React.useMemo(
    () => (child: string) => {
      setCurrentPage(["child", child]);
    },
    [setCurrentPage],
  );

  const userPageRecommendationCallback = React.useMemo(
    () => (child: string, recommendation: string | undefined) => {
      setCurrentPage(["edit-recommendation", child, recommendation]);
    },
    [setCurrentPage],
  );

  const userPageBackCallback = React.useMemo(
    () => () => {
      setCurrentPage(["user"]);
    },
    [setCurrentPage],
  );

  switch (currentPage[0]) {
    case "user":
      return (
        <UserPage
          getUser={params.getUser}
          childCallback={userPageChildCallback}
          addChild={params.addChild}
          backCallback={userPageBackCallback}
        />
      );
    case "child":
      return (
        <ChildPage
          getChild={params.getChild}
          childName={currentPage[1]}
          backCallback={userPageBackCallback}
          recommendationCallback={userPageRecommendationCallback}
        />
      );
    case "edit-recommendation":
      return (
        <EditRecommendationPage
          child={currentPage[1]}
          recommendation={currentPage[2]}
          backCallback={() => userPageChildCallback(currentPage[1])}
          getRecommendation={params.getRecommendation}
          saveRecommendation={params.saveRecommendation}
        />
      );
    default:
      return <div onClick={userPageBackCallback}>Nothing to see here.</div>;
  }
};
