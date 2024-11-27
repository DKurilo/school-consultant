export interface IBuildRecommendation {
  execute: (childName: string, recommendationTitle: string) => Promise<void>;
}
