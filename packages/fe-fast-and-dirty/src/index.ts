import { z } from "zod";
import { WebReact } from "./controllers/web-react";
import { Tokens } from "./domains/tokens";
import { Authenticator } from "./gateways/authenticator";
import { MemoryTokensGetter } from "./gateways/memory-tokens-getter";
import { MemoryTokensPreserver } from "./gateways/memory-tokens-preserver";
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
import {AddChild} from "./usecases/add-child";
import {ChildAdder} from "./gateways/child-adder";

declare let WEBPACK_CONFIG: unknown;

const ConfigParser = z.object({
  REFRESH_MS: z.coerce.number(),
  CHECK_AUTH_INTERVAL_MS: z.coerce.number(),
  SERVER_URL: z.string(),
  NODE_ENV: z.string(),
});

const main = () => {
  const conf = ConfigParser.parse(WEBPACK_CONFIG);
  const storage: Tokens[] = [];
  const serverUrl = conf.SERVER_URL;
  const authenticator: IAuthenticator = new Authenticator(serverUrl);
  const tokensRefresher: ITokensRefresher = new TokensRefresher(serverUrl);
  const tokensPreserver: ITokensPreserver = new MemoryTokensPreserver(storage);
  const tokensGetter: ITokensGetter = new MemoryTokensGetter(storage);
  const authenticateUsecase: IAuthenticate = new Authenticate(
    authenticator,
    tokensPreserver,
  );
  const refreshTokensUsecase: IRefreshTokens = new RefreshTokens(
    tokensGetter,
    tokensRefresher,
    tokensPreserver,
  );
  const checkIfAuthenticatedUsecase = new CheckIfAuthenticated(storage);
  const userGetter: IUserGetter = new UserGetter(serverUrl);
  const getUserUsecase = new GetUser(tokensGetter, userGetter);
  const childAdder = new ChildAdder(serverUrl);
  const addChildUsecase = new AddChild(tokensGetter, childAdder);
  const app: IApp = new WebReact(
    conf.REFRESH_MS,
    conf.CHECK_AUTH_INTERVAL_MS,
    authenticateUsecase,
    refreshTokensUsecase,
    checkIfAuthenticatedUsecase,
    getUserUsecase,
    addChildUsecase,
  );
  app.run();
};

main();
