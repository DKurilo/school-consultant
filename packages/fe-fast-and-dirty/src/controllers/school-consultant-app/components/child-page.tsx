import * as React from "react";
import { IGetChild } from "../../../ports/get-child";
import "./styles/child-page.css";
import { RecommendationStatus } from "@school-consultant/common/src/domains/recommendation";
import Button from "@mui/material/Button";

export type ChildPageParams = {
  childName: string;
  getChild: IGetChild;
  backCallback: () => void;
  recommendationCallback: (
    child: string,
    recommendation: string | undefined,
  ) => void;
  viewRecommendationCallback: (
    child: string,
    recommendation: string | undefined,
  ) => void;
};

export const ChildPage = (params: ChildPageParams) => {
  const [recommendations, setRecommendations] = React.useState<
    Record<string, RecommendationStatus>
  >({});

  const loadChild = async () => {
    const child = await params.getChild.execute(params.childName);
    setRecommendations(child.recommendations ?? {});
  };

  React.useEffect(() => {
    loadChild();
  }, []);

  const handlerClickRecommendation = React.useMemo(
    () => (name: string | undefined, status: RecommendationStatus) => {
      switch (status) {
        case "new":
          params.recommendationCallback(params.childName, name);
          return;
        case "ready":
          params.viewRecommendationCallback(params.childName, name);
          return;
        default:
          return;
      }
    },
    [],
  );

  return (
    <div className="child-page">
      <div>
        <Button
          variant="contained"
          type="submit"
          size="small"
          onClick={params.backCallback}
        >
          Back
        </Button>
      </div>
      <h1>{params.childName}</h1>
      <ul>
        {Object.entries(recommendations).map(([recommendation, status]) => (
          <li
            onClick={() => handlerClickRecommendation(recommendation, status)}
            key={recommendation}
          >
            {recommendation} <i>{status}</i>
            {status === "new" && " Click to Edit"}
            {status === "ready" && " Click to View"}
          </li>
        ))}
      </ul>
      <div onClick={() => handlerClickRecommendation(undefined, "new")}>
        New recommendation
      </div>
    </div>
  );
};
