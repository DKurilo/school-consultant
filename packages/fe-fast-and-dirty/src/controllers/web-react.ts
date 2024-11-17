import {IAddChild} from "../ports/add-child";
import { IApp } from "../ports/app";
import { IAuthenticate } from "../ports/authenticate";
import { ICheckIfAuthenticated } from "../ports/check-if-authenticated";
import { IGetUser } from "../ports/get-user";
import { IRefreshTokens } from "../ports/refresh-tokens";
import { main } from "./school-consultant-app";

export class WebReact implements IApp {
  private refreshInterval: number;
  private checkAuthInterval: number;
  private authenticateUsecase: IAuthenticate;
  private refreshTokensUsecase: IRefreshTokens;
  private checkAuthUsecase: ICheckIfAuthenticated;
  private getUserUsecase: IGetUser;
  private addChildUsecase: IAddChild;
  public constructor(
    refreshInterval: number,
    checkAuthInterval: number,
    authenticateUsecase: IAuthenticate,
    refreshTokensUsecase: IRefreshTokens,
    checkAuthUsecase: ICheckIfAuthenticated,
    getUserUsecase: IGetUser,
    addChildUsecase: IAddChild,
  ) {
    this.refreshInterval = refreshInterval;
    this.checkAuthInterval = checkAuthInterval;
    this.authenticateUsecase = authenticateUsecase;
    this.refreshTokensUsecase = refreshTokensUsecase;
    this.checkAuthUsecase = checkAuthUsecase;
    this.getUserUsecase = getUserUsecase;
    this.addChildUsecase = addChildUsecase;
  }
  public run(): void {
    // start token refresh process
    setInterval(
      this.refreshTokensUsecase.execute.bind(this.refreshTokensUsecase),
      this.refreshInterval,
    );
    // start app
    main(
      this.checkAuthInterval,
      this.authenticateUsecase,
      this.checkAuthUsecase,
      this.getUserUsecase,
      this.addChildUsecase,
    );
  }
}
