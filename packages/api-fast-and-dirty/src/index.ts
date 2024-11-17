import dotenv from "dotenv";
import { resolve } from "node:path";
import { FastifyWebServer } from "./controllers/fastify-web-server";
import { FsUser } from "./gateways/fs-user";
import { IApp } from "./ports/app";
import { mkLogger } from "./utils/pino-logger";
import { IUserGetter } from "./ports/user-getter";
import { ITokenGenerator } from "./ports/token-generator";
import { JwtTokenGenerator } from "./gateways/jwt-token-generator";
import { ILogin } from "./ports/login";
import { Login } from "./usecases/login";
import { IUserPreserver } from "./ports/user-preserver";
import { IRefreshToken } from "./ports/refresh-token";
import { RefreshToken } from "./usecases/refreshToken";
import { ITokenChecker } from "./ports/token-checker";
import { JwtTokenChecker } from "./gateways/jwt-token-checker";
import { z } from "zod";
import { IGetUser } from "./ports/get-user";
import { GetUserInfo } from "./usecases/get-user-info";
import { IAddChild } from "./ports/add-child";
import { AddChild } from "./usecases/add-child";

const ConfigParser = z.object({
  CORS_ORIGIN: z.string(),
  SECRET: z.string(),
  STORAGE_PATH: z.string(),
  HTTP_PORT: z.coerce.number(),
  TOKEN_DURATION: z.coerce.number(),
});

type Config = z.infer<typeof ConfigParser>;

const main = () => {
  dotenv.config();
  const conf: Config = ConfigParser.parse(process.env);
  const storagePath = conf.STORAGE_PATH.startsWith(".")
    ? resolve(__dirname, "..", conf.STORAGE_PATH)
    : conf.STORAGE_PATH;
  const logger = mkLogger();
  const userGateway = new FsUser(storagePath, logger);
  const userGetter: IUserGetter = userGateway;
  const userPreserver: IUserPreserver = userGateway;
  const tokenGenerator: ITokenGenerator = new JwtTokenGenerator(
    logger,
    conf.SECRET,
    conf.TOKEN_DURATION,
  );
  const loginUsecase: ILogin = new Login(
    logger,
    userGetter,
    userPreserver,
    tokenGenerator,
  );
  const tokenChecker: ITokenChecker = new JwtTokenChecker(logger, conf.SECRET);
  const refreshTokenUsecase: IRefreshToken = new RefreshToken(
    logger,
    userGetter,
    userPreserver,
    tokenGenerator,
    tokenChecker,
  );
  const getUserInfoUsecase: IGetUser = new GetUserInfo(
    logger,
    tokenChecker,
    userGetter,
  );
  const addChildUsecase: IAddChild = new AddChild(
    logger,
    tokenChecker,
    userGetter,
    userPreserver,
  );
  const app: IApp = new FastifyWebServer(
    logger,
    conf.HTTP_PORT,
    conf.CORS_ORIGIN,
    loginUsecase,
    refreshTokenUsecase,
    getUserInfoUsecase,
    addChildUsecase,
  );
  app.run();
};

main();
