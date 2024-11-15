import { IApp } from "../ports/app";
import { IAuthenticate } from "../ports/authenticate";
import { ICheckIfAuthenticated } from "../ports/check-if-authenticated";
import { IRefreshTokens } from "../ports/refresh-tokens";
import { main } from "./school-consultant-app";

export class WebReact implements IApp {
  private refreshInterval: number;
  private checkAuthInterval: number;
  private authenticateUsecase: IAuthenticate;
  private refreshTokensUsecase: IRefreshTokens;
  private checkAuth: ICheckIfAuthenticated;
  public constructor(
    refreshInterval: number,
    checkAuthInterval: number,
    authenticateUsecase: IAuthenticate,
    refreshTokensUsecase: IRefreshTokens,
    checkAuth: ICheckIfAuthenticated,
  ) {
    this.refreshInterval = refreshInterval;
    this.checkAuthInterval = checkAuthInterval;
    this.authenticateUsecase = authenticateUsecase;
    this.refreshTokensUsecase = refreshTokensUsecase;
    this.checkAuth = checkAuth;
  }
  public run(): void {
    // start token refresh process
    setInterval(
      this.refreshTokensUsecase.execute.bind(this.refreshTokensUsecase),
      this.refreshInterval,
    );
    // start app
    main(this.checkAuthInterval, this.authenticateUsecase, this.checkAuth);
  }
}
