import { IUserGetter } from "../ports/user-getter";
import { ILogger } from "../ports/logger";
import { ITokenChecker } from "../ports/token-checker";
import { Token } from "@school-consultant/common/src/domains/token";
import { IBuildRecommendation } from "../ports/build-recommendation";
import { ICoordsGetter } from "../ports/coords-getter";
import { IUserPreserver } from "../ports/user-preserver";
import { School } from "@school-consultant/common";
import { ISchoolsListGetter } from "../ports/schools-list-getter";
import { ITimesGetter } from "../ports/times-getter";
import { IStrategyGenerator } from "../ports/strategy-generator";
import { IRecommendationPreserver } from "../ports/recommendation-preserver";

export class BuildRecommendation implements IBuildRecommendation {
  private logger: ILogger;
  private tokenChecker: ITokenChecker;
  private userGetter: IUserGetter;
  private userPreserver: IUserPreserver;
  private coordsGetter: ICoordsGetter;
  private schoolsListGetter: ISchoolsListGetter;
  private timesGetter: ITimesGetter;
  private strategyGenerator: IStrategyGenerator;
  private recommendationPreserver: IRecommendationPreserver;

  public constructor(
    logger: ILogger,
    tokenChecker: ITokenChecker,
    userGetter: IUserGetter,
    userPreserver: IUserPreserver,
    coordsGetter: ICoordsGetter,
    schoolsListGetter: ISchoolsListGetter,
    timesGetter: ITimesGetter,
    strategyGenerator: IStrategyGenerator,
    recommendationPreserver: IRecommendationPreserver,
  ) {
    this.logger = logger;
    this.tokenChecker = tokenChecker;
    this.userGetter = userGetter;
    this.userPreserver = userPreserver;
    this.coordsGetter = coordsGetter;
    this.schoolsListGetter = schoolsListGetter;
    this.timesGetter = timesGetter;
    this.strategyGenerator = strategyGenerator;
    this.recommendationPreserver = recommendationPreserver;
  }

  private async buildTokenContent(token: string): Promise<Token | undefined> {
    try {
      const tokenContent = await this.tokenChecker.verify(token);
      return tokenContent;
    } catch (e) {
      this.logger.debug(
        `Token is invalid while building user for token ${token} error: ${e}`,
      );
      return undefined;
    }
  }

  public async execute(
    token: string,
    childName: string,
    recommendationTitle: string,
    callback: (
      err:
        | undefined
        | "not found"
        | "no access"
        | "already finished"
        | "no attempts left",
    ) => void,
  ): Promise<void> {
    const tokenContent = await this.buildTokenContent(token);

    if (tokenContent === undefined) {
      callback("no access");
      return;
    }

    const user = await this.userGetter.getUser(tokenContent.email);
    if (user === undefined || !(childName in user.children)) {
      callback("not found");
      return;
    }
    if (user.attemptsLeft <= 0) {
      callback("no attempts left");
    }
    const child = user.children[childName];
    if (!(recommendationTitle in child.recommendations)) {
      callback("not found");
      return;
    }
    const recommendation = child.recommendations[recommendationTitle];

    if (recommendation.status !== "new") {
      callback("already finished");
    }
    user.attemptsLeft = user.attemptsLeft - 1;
    recommendation.status = "building";
    await this.userPreserver.preserveUser(user);
    callback(undefined);

    recommendation.address.coords = await this.coordsGetter.getCoords(
      recommendation.address,
    );
    const schools: School[] =
      await this.schoolsListGetter.getSchoolsList(recommendation);
    await Promise.all(
      schools.map(async (school) => {
        try {
          school.address.coords = await this.coordsGetter.getCoords(
            school.address,
          );
        } catch (e) {
          this.logger.warn(
            `Could not get coords for school ${JSON.stringify(school)}, err: ${e}`,
          );
        }
        return;
      }),
    );
    const goodSchools = schools.filter(
      (school) => school.address.coords !== undefined,
    );
    const schoolCoords = goodSchools.map(
      (school) => school.address.coords ?? { latitude: 0, longitude: 0 },
    );
    const carTimes = await this.timesGetter.getTimes(
      [recommendation.address.coords],
      schoolCoords,
      "car",
    );
    const walkTimes = await this.timesGetter.getTimes(
      [recommendation.address.coords],
      schoolCoords,
      "walk",
    );
    const transportTimes = await this.timesGetter.getTimes(
      [recommendation.address.coords],
      schoolCoords,
      "transport",
    );

    goodSchools.forEach((school, i) => {
      school.carTime = carTimes[0][i];
      school.walkTime = walkTimes[0][i];
      school.transportTime = transportTimes[0][i];
    });

    recommendation.schools = goodSchools.filter((school) => {
      if (
        school.carTime === undefined &&
        school.transportTime === undefined &&
        school.walkTime === undefined
      ) {
        return false;
      }
      const minTime = Math.min(
        ...[school.carTime, school.transportTime, school.walkTime].filter(
          (t) => t !== undefined,
        ),
      );
      return minTime <= 3600; // can reach a school in 1 hour or less
    });

    await Promise.all(
      recommendation.schools.map(async (school) => {
        try {
          const strategy = await this.strategyGenerator.generateStrategy(
            recommendation,
            school,
          );
          school.strategy = strategy;
        } catch (e) {
          this.logger.warn(
            `Could not get recommendation for ${JSON.stringify(school)}, err: ${e}`,
          );
        }
      }),
    );

    recommendation.status = "ready";
    await this.userPreserver.preserveUser(user);
    await this.recommendationPreserver.preserveRecommendation(recommendation);
  }
}
