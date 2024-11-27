export interface IRecommendationBuilder {
  buildRecommendation: (
    token: string,
    childName: string,
    recommendationTitle: string,
  ) => Promise<void>;
}
