import { IApp } from "../ports/app";
import { IGetRoRecommendation } from "../ports/get-ro-recommendation";
import { mainRo } from "./school-consultant-app";

export class WebReactRo implements IApp {
  private googleApiKey: string;
  private getRoRecommendation: IGetRoRecommendation;
  private roToken: string;

  public constructor(
    googleApiKey: string,
    getRoRecommendation: IGetRoRecommendation,
    roToken: string,
  ) {
    this.googleApiKey = googleApiKey;
    this.getRoRecommendation = getRoRecommendation;
    this.roToken = roToken;
  }
  public run(): void {
    // start app
    mainRo(this.googleApiKey, this.getRoRecommendation, this.roToken);
  }
}
