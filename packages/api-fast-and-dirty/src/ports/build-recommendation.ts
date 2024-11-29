export interface IBuildRecommendation {
  // retuns callback that should be started after user received response
  execute: (
    token: string,
    child: string,
    recommendationTitle: string,
    callback: (
      err:
        | undefined
        | "not found"
        | "no access"
        | "already finished"
        | "no attempts left",
    ) => void,
  ) => Promise<void>;
}
