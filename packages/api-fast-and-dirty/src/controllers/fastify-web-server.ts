import { fastify, FastifyInstance, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { IApp } from "../ports/app";
import { ILogger } from "../ports/logger";
import {
  IncomingHttpHeaders,
  IncomingMessage,
  Server,
  ServerResponse,
} from "http";
import { ILogin } from "../ports/login";
import { z } from "zod";
import { IRefreshToken } from "../ports/refresh-token";
import { IGetUser } from "../ports/get-user";
import { IAddChild } from "../ports/add-child";
import { IGetChild } from "../ports/get-child";
import { ISaveRecommendation } from "../ports/save-recommendation";
import { RecommendationInputParser } from "@school-consultant/common";
import {IGetRecommendation} from "../ports/get-gecommendation";

const LoginParser = z.object({
  email: z.string(),
  password: z.string(),
});

const RefreshTokenParser = z.object({
  refreshToken: z.string(),
});

const ChildRequestParser = z.object({
  name: z.string(),
});

type ChildRequest = z.infer<typeof ChildRequestParser>;

const RecommendationAndChildParser = z.object({
  child: z.string(),
  recommendation: RecommendationInputParser,
});

type RecommendationRequest = {
  "child-name": string;
  "recommendation-title": string;
}

export class FastifyWebServer implements IApp {
  private server: FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse,
    ILogger
  >;
  private port: number;
  private origin: string;
  private logger: ILogger;
  private loginUsecase: ILogin;
  private refreshTokenUsecase: IRefreshToken;
  private getUserInfoUsecase: IGetUser;
  private addChildUsecase: IAddChild;
  private getChildUsecase: IGetChild;
  private saveRecommendationUsecase: ISaveRecommendation;
  private getRecommendationUsecase: IGetRecommendation;

  public constructor(
    logger: ILogger,
    port: number,
    origin: string,
    loginUsecase: ILogin,
    refreshTokenUsecase: IRefreshToken,
    getUserInfoUsecase: IGetUser,
    addChildUsecase: IAddChild,
    getChildUsecase: IGetChild,
    saveRecommendationUsecase: ISaveRecommendation,
    getRecommendationUsecase: IGetRecommendation,
  ) {
    this.logger = logger;
    this.port = port;
    this.origin = origin;
    this.loginUsecase = loginUsecase;
    this.refreshTokenUsecase = refreshTokenUsecase;
    this.getUserInfoUsecase = getUserInfoUsecase;
    this.addChildUsecase = addChildUsecase;
    this.getChildUsecase = getChildUsecase;
    this.saveRecommendationUsecase = saveRecommendationUsecase;
    this.getRecommendationUsecase = getRecommendationUsecase;
    this.server = fastify({ loggerInstance: this.logger });
    this.server.register(cors, { origin: this.origin });

    this.server.get("/health", async (request, reply) => {
      console.log(request.headers);
      reply.statusCode = 200;
      reply.send("ok");
    });

    this.server.post("/login", async (request, reply) => {
      try {
        const body = LoginParser.parse(request.body);
        const tokens = await this.loginUsecase.execute(
          body.email,
          body.password,
        );
        if (tokens === undefined) {
          reply.statusCode = 403;
          reply.send("not authorized");
          return;
        }
        const [token, refreshToken] = tokens;
        reply.statusCode = 200;
        reply.send({ token, refreshToken });
      } catch (e) {
        this.logger.error(`error ${e}`);
        reply.statusCode = 500;
        reply.send("something is wrong");
      }
    });

    this.server.post("/refresh", async (request, reply) => {
      try {
        const body = RefreshTokenParser.parse(request.body);
        const token = this.getJwt(request.headers);
        if (token === undefined) {
          reply.status(403);
          reply.send("no token");
          return;
        }
        const tokens = await this.refreshTokenUsecase.execute(
          token,
          body.refreshToken,
        );
        if (tokens === undefined) {
          reply.statusCode = 403;
          reply.send("not authorized");
          return;
        }
        const [newToken, refreshToken] = tokens;
        reply.statusCode = 200;
        reply.send({ token: newToken, refreshToken });
      } catch (e) {
        this.logger.error(`error ${e}`);
        reply.statusCode = 500;
        reply.send("something is wrong");
      }
    });

    this.server.get("/user", async (request, reply) => {
      try {
        const token = this.getJwt(request.headers);
        if (token === undefined) {
          reply.status(403);
          reply.send("no token");
          return;
        }
        const response = await this.getUserInfoUsecase.execute(token);
        if (response === "not found") {
          reply.status(404);
          reply.send("user not found");
        }
        if (response === "no access") {
          reply.status(403);
          reply.send("no access");
        }
        reply.status(200);
        reply.send(response);
      } catch (e) {
        this.response500(e, reply);
      }
    });

    this.server.post("/child", async (request, reply) => {
      try {
        const body = ChildRequestParser.parse(request.body);
        const token = this.getJwt(request.headers);
        if (token === undefined) {
          reply.status(403);
          reply.send("no token");
          return;
        }
        const result = await this.addChildUsecase.execute(token, body.name);
        if (result === "no access") {
          reply.status(403);
          reply.send("no access");
        }
        if (result === "user not found") {
          reply.status(404);
          reply.send("user not found");
        }
        if (result === "child already exists") {
          reply.status(400);
          reply.send("child already exists");
        }
        reply.statusCode = 201;
        reply.send();
      } catch (e) {
        this.logger.error(`error ${e}`);
        reply.statusCode = 500;
        reply.send("something is wrong");
      }
    });

    this.server.get<{ Querystring: ChildRequest }>(
      "/child",
      async (request, reply) => {
        try {
          const token = this.getJwt(request.headers);
          if (token === undefined) {
            reply.status(403);
            reply.send("no token");
            return;
          }
          const child = request.query.name;
          const response = await this.getChildUsecase.execute(token, child);
          if (response === "not found") {
            reply.status(404);
            reply.send("user not found");
          }
          if (response === "no access") {
            reply.status(403);
            reply.send("no access");
          }
          reply.status(200);
          reply.send(response);
        } catch (e) {
          this.response500(e, reply);
        }
      },
    );

    this.server.post("/recommendation", async (request, reply) => {
      try {
        const body = RecommendationAndChildParser.parse(request.body);
        const token = this.getJwt(request.headers);
        if (token === undefined) {
          reply.status(403);
          reply.send("no token");
          return;
        }
        const result = await this.saveRecommendationUsecase.execute(
          token,
          body.child,
          body.recommendation,
        );
        if (result === "no access") {
          reply.status(403);
          reply.send("no access");
        }
        if (result === "user not found") {
          reply.status(404);
          reply.send("user not found");
        }
        if (result === "child not found") {
          reply.status(404);
          reply.send("child not found");
        }
        reply.statusCode = 201;
        reply.send();
      } catch (e) {
        this.logger.error(`error ${e}`);
        reply.statusCode = 500;
        reply.send("something is wrong");
      }
    });

    this.server.get<{ Querystring: RecommendationRequest }>(
      "/recommendation",
      async (request, reply) => {
        try {
          const token = this.getJwt(request.headers);
          if (token === undefined) {
            reply.status(403);
            reply.send("no token");
            return;
          }
          const child = request.query["child-name"];
          const recommendation = request.query["recommendation-title"];
          const response = await this.getRecommendationUsecase.execute(token, child, recommendation);
          if (response === "not found") {
            reply.status(404);
            reply.send("user/child or recommendation not found");
          }
          if (response === "no access") {
            reply.status(403);
            reply.send("no access");
          }
          reply.status(200);
          reply.send(response);
        } catch (e) {
          this.response500(e, reply);
        }
      },
    );
  }

  private response500(e: unknown, reply: FastifyReply) {
    this.logger.error(`error ${e}`);
    reply.statusCode = 500;
    reply.send("something is wrong");
  }

  private getJwt(headers: IncomingHttpHeaders): string | undefined {
    const auth = headers.authorization;
    if (auth && auth.startsWith("Bearer ")) {
      return auth.slice("Bearer ".length);
    }
    return undefined;
  }

  public run() {
    this.server.listen({ port: this.port }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  }
}
