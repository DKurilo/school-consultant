import dotenv from "dotenv";
import { join, resolve } from "node:path";
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
import { IGetChild } from "./ports/get-child";
import { GetChild } from "./usecases/get-child";
import { ISaveRecommendation } from "./ports/save-recommendation";
import { SaveRecommendation } from "./usecases/save-recommendation";
import { IGetRecommendation } from "./ports/get-recommendation";
import { GetRecommendation } from "./usecases/get-recommendation";
import { OpenaiDriver } from "./drivers/openai-driver";
import { GoogleApiDriver } from "./drivers/google-api-driver";
import { BuildRecommendation } from "./usecases/build-recommendation";
import { GoogleCoordsGetter } from "./gateways/google-coord-getter";
import { OpenaiSchoolsListGetter } from "./gateways/openai-schools-list-getter";
import { ICoordsGetter } from "./ports/coords-getter";
import { ISchoolsListGetter } from "./ports/schools-list-getter";
import { IBuildRecommendation } from "./ports/build-recommendation";
import { IStrategyGenerator } from "./ports/strategy-generator";
import { OpenaiStrategyGenerator } from "./gateways/openai-strategy-generator";
import { IRecommendationPreserver } from "./ports/recommendation-preserver";
import { FsRecommendation } from "./gateways/fs-recommendation";
import { IGetReadOnlyRecommendation } from "./ports/get-read-only-recommendation";
import { GetReadOnlyRecommendation } from "./usecases/get-read-only-recommendation";
import { IRecommendationGetter } from "./ports/recommendation-getter";
import { ITimesGetter } from "./ports/times-getter";
import { GoogleTimesGetter } from "./gateways/google-times-getter";

const ConfigParser = z.object({
  CORS_ORIGIN: z.string(),
  SECRET: z.string(),
  STORAGE_PATH: z.string(),
  HTTP_PORT: z.coerce.number(),
  TOKEN_DURATION: z.coerce.number(),
  OPENAI_ORGANIZATION: z.string(),
  OPENAI_PROJECT: z.string(),
  OPENAI_SECRET: z.string(),
  GOOGLE_API_KEY: z.string(),
});

type Config = z.infer<typeof ConfigParser>;

const main = () => {
  dotenv.config();
  const conf: Config = ConfigParser.parse(process.env);
  const storagePath = conf.STORAGE_PATH.startsWith(".")
    ? resolve(__dirname, "..", conf.STORAGE_PATH)
    : conf.STORAGE_PATH;
  const usersStoragePath = join(storagePath, "users");
  const recommendaionsStoragePath = join(storagePath, "recommendations");
  const logger = mkLogger();
  const userGateway = new FsUser(usersStoragePath, logger);
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
  const getChildUsecase: IGetChild = new GetChild(
    logger,
    tokenChecker,
    userGetter,
  );
  const saveRecommendationUsecase: ISaveRecommendation = new SaveRecommendation(
    logger,
    tokenChecker,
    userGetter,
    userPreserver,
  );
  const getRecommendationUsecase: IGetRecommendation = new GetRecommendation(
    logger,
    tokenChecker,
    userGetter,
  );
  const openaiDriver = new OpenaiDriver(
    logger,
    conf.OPENAI_ORGANIZATION,
    conf.OPENAI_PROJECT,
    conf.OPENAI_SECRET,
  );
  const googleDriver = new GoogleApiDriver(logger, conf.GOOGLE_API_KEY);
  const coordsGetter: ICoordsGetter = new GoogleCoordsGetter(
    logger,
    googleDriver,
  );
  const schoolsListGetter: ISchoolsListGetter = new OpenaiSchoolsListGetter(
    logger,
    openaiDriver,
  );
  const distanceGetter: ITimesGetter = new GoogleTimesGetter(googleDriver);
  const strategyGenerator: IStrategyGenerator = new OpenaiStrategyGenerator(
    openaiDriver,
  );
  const recommendationGateway = new FsRecommendation(
    recommendaionsStoragePath,
    logger,
  );
  const recommendationPreserver: IRecommendationPreserver =
    recommendationGateway;
  const recommendationGetter: IRecommendationGetter = recommendationGateway;
  const buildRecommendationUsecase: IBuildRecommendation =
    new BuildRecommendation(
      logger,
      tokenChecker,
      userGetter,
      userPreserver,
      coordsGetter,
      schoolsListGetter,
      distanceGetter,
      strategyGenerator,
      recommendationPreserver,
    );
  const getReadOnlyRecommendationUsecase: IGetReadOnlyRecommendation =
    new GetReadOnlyRecommendation(logger, recommendationGetter);
  const app: IApp = new FastifyWebServer(
    logger,
    conf.HTTP_PORT,
    conf.CORS_ORIGIN,
    loginUsecase,
    refreshTokenUsecase,
    getUserInfoUsecase,
    addChildUsecase,
    getChildUsecase,
    saveRecommendationUsecase,
    getRecommendationUsecase,
    buildRecommendationUsecase,
    getReadOnlyRecommendationUsecase,
  );
  app.run();
};

main();
