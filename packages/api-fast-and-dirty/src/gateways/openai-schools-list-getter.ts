import {
  Recommendation,
  School,
  SchoolParser,
} from "@school-consultant/common";
import { OpenaiDriver } from "../drivers/openai-driver";
import { ISchoolsListGetter } from "../ports/schools-list-getter";
import { ILogger } from "../ports/logger";

export class OpenaiSchoolsListGetter implements ISchoolsListGetter {
  private logger: ILogger;
  private openAIDriver: OpenaiDriver;

  public constructor(logger: ILogger, openAIDriver: OpenaiDriver) {
    this.logger = logger;
    this.openAIDriver = openAIDriver;
  }

  private parseSchoolList(text: string): School[] {
    this.logger.debug(`parseSchoolList input: ${text}`);
    const nameRegex = new RegExp(/\**(\d+)\.[ *]*(.*)\*\*.*/);
    const arr = text.split("\n");
    arr.pop();
    arr.push("~~~EOF~~~");
    return arr.reduce<[School[], Partial<School>, string]>(
      ([schs, sch, step], line) => {
        if (line === "~~~EOF~~~") {
          const lastSch = SchoolParser.safeParse(sch);
          if (lastSch.success) {
            schs.push(lastSch.data);
          }
          return [schs, {}, ""];
        }
        const sline = line.trim();
        if (sline === "" || sline === "---" || sline === "===") {
          return [schs, sch, step];
        }
        const nameMatch = nameRegex.exec(sline);
        if (nameMatch !== null) {
          const prevSch = SchoolParser.safeParse(sch);
          if (prevSch.success) {
            schs.push(prevSch.data);
          }
          const name = nameMatch[2].replace(/\**/g, "");
          return [
            schs,
            { rank: parseInt(nameMatch[1], 10), name: name },
            "address",
          ];
        }
        if (step === "address") {
          const slineNoFormatting = sline.replace(/\**/g, "");
          const addr =
            slineNoFormatting.startsWith("Address:") ||
            sline.startsWith("address:")
              ? sline.slice(8)
              : sline;
          Object.assign(sch, { address: { addr: addr.trim() } });
          return [schs, sch, "description"];
        }
        if (step === "description") {
          const slineNoFormatting = sline.replace(/\**/g, "");
          const description =
            slineNoFormatting.startsWith("Description:") ||
            slineNoFormatting.startsWith("description:")
              ? slineNoFormatting.slice(12)
              : slineNoFormatting;
          Object.assign(sch, {
            description: sch?.description
              ? `${sch.description}\n${description.trim()}`
              : description.trim(),
          });
        }
        return [schs, sch, step];
      },
      [[], {}, "empty"],
    )[0];
  }

  public async getSchoolsList(
    recommendation: Recommendation,
  ): Promise<School[]> {
    const clientLocation =
      "zip" in recommendation.address
        ? `zip-code ${recommendation.address.zip}`
        : `address ${recommendation.address.addr}`;
    const systemLocation =
      "zip" in recommendation.address
        ? `in ${recommendation.address.city}, ${recommendation.address.state}`
        : `close to ${recommendation.address.addr}`;
    const addrString =
      "zip" in recommendation.address
        ? `${recommendation.address.street}, ${recommendation.address.city}, ${recommendation.address.state}, ${recommendation.address.zip}`
        : recommendation.address.addr;
    const systemPrompt = `You are a high school education consultant that works more than 10 years mostly ${systemLocation} and have a client with ${clientLocation} who you want to help to find their dream high school. Using data provided by client build a list of up to 50 high schools that are the best choice given clients location and interests and additional information. For each school add name, address, description and reason why you selected it. Put name, adress and description and reason to select on new line and separate schools with two empty lines, please. And return only high schools, please.`;
    const userPropmt = `The client address is ${addrString}. The client has these interests: ${recommendation.interests.join(", ")}. And here is additional information to consider while preparing school list: ${recommendation.additionalInfo}`;
    const response = await this.openAIDriver.getResponse(
      recommendation.readOnlyKey,
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPropmt },
      ],
    );
    return this.parseSchoolList(response);
  }
}
