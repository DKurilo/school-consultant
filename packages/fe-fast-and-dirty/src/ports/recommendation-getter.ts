import {Recommendation} from "@school-consultant/common";

export interface IRecommendationGetter {
  getRecommendation: (token: string, childName: string, recommendationTitle: string) => Promise<Recommendation>;
}

