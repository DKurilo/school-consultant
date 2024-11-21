import { z } from "zod";
import { WebReact } from "./controllers/web-react";
import { Authenticator } from "./gateways/authenticator";
import { TokensRefresher } from "./gateways/tokens-refresher";
import { IApp } from "./ports/app";
import { IAuthenticate } from "./ports/authenticate";
import { IAuthenticator } from "./ports/authenticator";
import { IRefreshTokens } from "./ports/refresh-tokens";
import { ITokensGetter } from "./ports/tokens-getter";
import { ITokensPreserver } from "./ports/tokens-preserver";
import { ITokensRefresher } from "./ports/tokens-refresher";
import { Authenticate } from "./usecases/authenticate";
import { CheckIfAuthenticated } from "./usecases/check-if-authenticated";
import { RefreshTokens } from "./usecases/refresh-tokens";
import { GetUser } from "./usecases/get-user";
import { IUserGetter } from "./ports/user-getter";
import { UserGetter } from "./gateways/user-getter";
import { AddChild } from "./usecases/add-child";
import { ChildAdder } from "./gateways/child-adder";
import { StorageTokensPreserver } from "./gateways/storage-tokens-preserver";
import { StorageTokensGetter } from "./gateways/storage-tokens-getter";
import { IChildGetter } from "./ports/child-getter";
import { IAddChild } from "./ports/add-child";
import { IChildAdder } from "./ports/child-adder";
import { IGetUser } from "./ports/get-user";
import { ICheckIfAuthenticated } from "./ports/check-if-authenticated";
import { ChildGetter } from "./gateways/child-getter";
import { IGetChild } from "./ports/get-child";
import { GetChild } from "./usecases/get-child";
import { ISaveRecommendation } from "./ports/save-recommendation";
import { RecommendationInput } from "@school-consultant/common";

declare let WEBPACK_CONFIG: unknown;

const ConfigParser = z.object({
  REFRESH_MS: z.coerce.number(),
  CHECK_AUTH_INTERVAL_MS: z.coerce.number(),
  SERVER_URL: z.string(),
  NODE_ENV: z.string(),
});

const main = () => {
  const conf = ConfigParser.parse(WEBPACK_CONFIG);
  const storageName = "school-consultant-tokens";
  const serverUrl = conf.SERVER_URL;
  const authenticator: IAuthenticator = new Authenticator(serverUrl);
  const tokensRefresher: ITokensRefresher = new TokensRefresher(serverUrl);
  const tokensPreserver: ITokensPreserver = new StorageTokensPreserver(
    storageName,
  );
  const tokensGetter: ITokensGetter = new StorageTokensGetter(storageName);
  const authenticateUsecase: IAuthenticate = new Authenticate(
    authenticator,
    tokensPreserver,
  );
  const refreshTokensUsecase: IRefreshTokens = new RefreshTokens(
    tokensGetter,
    tokensRefresher,
    tokensPreserver,
  );
  const checkIfAuthenticatedUsecase: ICheckIfAuthenticated =
    new CheckIfAuthenticated(tokensGetter);
  const userGetter: IUserGetter = new UserGetter(serverUrl);
  const getUserUsecase: IGetUser = new GetUser(tokensGetter, userGetter);
  const childAdder: IChildAdder = new ChildAdder(serverUrl);
  const addChildUsecase: IAddChild = new AddChild(tokensGetter, childAdder);
  const childGetter: IChildGetter = new ChildGetter(serverUrl);
  const getChildUsecase: IGetChild = new GetChild(tokensGetter, childGetter);
  const saveRecommendation: ISaveRecommendation = {
    execute: async (child: string, recommendation: RecommendationInput) => {
      console.log(child, recommendation);
    },
  };
  const app: IApp = new WebReact(
    conf.REFRESH_MS,
    conf.CHECK_AUTH_INTERVAL_MS,
    authenticateUsecase,
    refreshTokensUsecase,
    checkIfAuthenticatedUsecase,
    getUserUsecase,
    addChildUsecase,
    getChildUsecase,
    saveRecommendation,
  );
  app.run();
};

main();
