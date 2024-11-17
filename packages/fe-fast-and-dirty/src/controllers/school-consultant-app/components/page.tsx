import * as React from "react";
import { IGetUser } from "../../../ports/get-user";
import { UserPage } from "./user-page";
import {IAddChild} from "../../../ports/add-child";

export type PageParams = {
  getUser: IGetUser;
  addChild: IAddChild;
};

export const Page = (params: PageParams) => {
  const [currentPage, setCurrentPage] = React.useState(["user"]);

  const userPageChildCallback = React.useMemo(
    () => (child: string) => {
      setCurrentPage(["child", child]);
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
        ></UserPage>
      );
    default:
      return <div onClick={userPageBackCallback}>Nothing to see here.</div>;
  }
};
