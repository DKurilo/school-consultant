import { IAddChild } from "../ports/add-child";
import { IApp } from "../ports/app";
import { IAuthenticate } from "../ports/authenticate";
import { IBuildRecommendation } from "../ports/build-recommendation";
import { ICheckIfAuthenticated } from "../ports/check-if-authenticated";
import { IGetChild } from "../ports/get-child";
import { IGetRecommendation } from "../ports/get-recommendation";
import { IGetUser } from "../ports/get-user";
import { IRefreshTokens } from "../ports/refresh-tokens";
import { ISaveRecommendation } from "../ports/save-recommendation";
import { main } from "./school-consultant-app";

export class WebReact implements IApp {
  private refreshInterval: number;
  private checkAuthInterval: number;
  private googleApiKey: string;
  private authenticateUsecase: IAuthenticate;
  private refreshTokensUsecase: IRefreshTokens;
  private checkAuthUsecase: ICheckIfAuthenticated;
  private getUserUsecase: IGetUser;
  private addChildUsecase: IAddChild;
  private getChildUsecase: IGetChild;
  private saveRecommendation: ISaveRecommendation;
  private getRecommendation: IGetRecommendation;
  private buildRecommendation: IBuildRecommendation;
  private baseUrl: string;

  public constructor(
    refreshInterval: number,
    checkAuthInterval: number,
    googleApiKey: string,
    authenticateUsecase: IAuthenticate,
    refreshTokensUsecase: IRefreshTokens,
    checkAuthUsecase: ICheckIfAuthenticated,
    getUserUsecase: IGetUser,
    addChildUsecase: IAddChild,
    getChildUsecase: IGetChild,
    saveRecommendation: ISaveRecommendation,
    getRecommendation: IGetRecommendation,
    buildRecommendation: IBuildRecommendation,
    baseUrl: string,
  ) {
    this.refreshInterval = refreshInterval;
    this.checkAuthInterval = checkAuthInterval;
    this.googleApiKey = googleApiKey;
    this.authenticateUsecase = authenticateUsecase;
    this.refreshTokensUsecase = refreshTokensUsecase;
    this.checkAuthUsecase = checkAuthUsecase;
    this.getUserUsecase = getUserUsecase;
    this.addChildUsecase = addChildUsecase;
    this.getChildUsecase = getChildUsecase;
    this.saveRecommendation = saveRecommendation;
    this.getRecommendation = getRecommendation;
    this.buildRecommendation = buildRecommendation;
    this.baseUrl = baseUrl;
  }
  public run(): void {
    // start token refresh process
    this.refreshTokensUsecase.execute();
    setInterval(() => {
      this.refreshTokensUsecase.execute();
    }, this.refreshInterval);
    // start app
    main(
      this.googleApiKey,
      this.checkAuthInterval,
      this.authenticateUsecase,
      this.checkAuthUsecase,
      this.getUserUsecase,
      this.addChildUsecase,
      this.getChildUsecase,
      this.saveRecommendation,
      this.getRecommendation,
      this.buildRecommendation,
      this.baseUrl,
    );
  }
}
