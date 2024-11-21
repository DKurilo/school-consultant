import * as React from "react";
import { IGetChild } from "../../../ports/get-child";
import "./styles/child-page.css";

export type ChildPageParams = {
  childName: string;
  getChild: IGetChild;
  backCallback: () => void;
  recommendationCallback: (
    child: string,
    recommendation: string | undefined,
  ) => void;
};

export const ChildPage = (params: ChildPageParams) => {
  const [recommendations, setRecommendations] = React.useState<
    Record<string, boolean>
  >({});

  const loadChild = async () => {
    const child = await params.getChild.execute(params.childName);
    setRecommendations(child.recommendations ?? {});
  };

  React.useEffect(() => {
    loadChild();
  }, []);

  const handlerEditRecommendation = React.useMemo(
    () => (name: string | undefined) => {
      params.recommendationCallback(params.childName, name);
    },
    [],
  );

  const handlerViewRecommendation = React.useMemo(
    () => (name: string) => {
      alert(`View ${name} recommendation`);
    },
    [],
  );

  return (
    <div className="child-page">
      <div onClick={params.backCallback}>Back</div>
      <h1>{params.childName}</h1>
      <ul>
        {Object.entries(recommendations).map(([recommendation, isFinished]) => (
          <li
            onClick={() =>
              isFinished
                ? handlerViewRecommendation(recommendation)
                : handlerEditRecommendation(recommendation)
            }
            key={recommendation}
          >
            {isFinished ? "View" : "Edit"} {recommendation}
          </li>
        ))}
      </ul>
      <div onClick={() => handlerEditRecommendation(undefined)}>
        New recommendation
      </div>
    </div>
  );
};
