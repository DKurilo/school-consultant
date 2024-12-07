import * as React from "react";
import { IGetChild } from "../../../ports/get-child";
import "./styles/child-page.css";
import { RecommendationStatus } from "@school-consultant/common/src/domains/recommendation";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

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
          type="button"
          size="small"
          onClick={params.backCallback}
        >
          Back
        </Button>
      </div>
      <h1>{params.childName}</h1>
      <Stack direction="column" spacing={1} alignItems="start">
        {Object.entries(recommendations).map(([recommendation, status]) => (
          <Button
            onClick={() => handlerClickRecommendation(recommendation, status)}
            key={recommendation}
          >
            Recommendation "{recommendation}" is {status}.
            {status === "new" && " Click to Edit."}
            {status === "ready" && " Click to View."}
          </Button>
        ))}
        <Button
          variant="contained"
          type="submit"
          onClick={() => handlerClickRecommendation(undefined, "new")}
        >
          New recommendation
        </Button>
      </Stack>
    </div>
  );
};
