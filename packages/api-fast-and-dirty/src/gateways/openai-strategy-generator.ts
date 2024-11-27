import { Recommendation, School } from "@school-consultant/common";
import { OpenaiDriver } from "../drivers/openai-driver";
import { IStrategyGenerator } from "../ports/strategy-generator";

export class OpenaiStrategyGenerator implements IStrategyGenerator {
  private openAIDriver: OpenaiDriver;

  public constructor(openAIDriver: OpenaiDriver) {
    this.openAIDriver = openAIDriver;
  }

  public async generateStrategy(
    recommendation: Recommendation,
    school: School,
  ): Promise<string> {
    const systemLocation =
      "zip" in recommendation.address
        ? `in ${recommendation.address.city}, ${recommendation.address.state}`
        : `close to ${recommendation.address.addr}`;
    const addrString =
      "zip" in recommendation.address
        ? `${recommendation.address.street}, ${recommendation.address.city}, ${recommendation.address.state}, ${recommendation.address.zip}`
        : recommendation.address.addr;
    const schoolAddr =
      "zip" in school.address
        ? `${school.address.street}, ${school.address.city}, ${school.address.state}, ${school.address.zip}`
        : school.address.addr;
    const systemPrompt = `You are high a school education consultant that works more than 10 years mostly ${systemLocation} and have a client who wants to be in ${school.name} that is located in ${schoolAddr}`;
    const userPropmt = `The client address is ${addrString}. The client has these interests: ${recommendation.interests.join(", ")}. And here is additional information to consider while : ${recommendation.additionalInfo}. The client wants to be in ${school.name} that is located in ${schoolAddr}. Prepare detailed strategy that can help the client to be invited to this school.`;
    const response = await this.openAIDriver.getResponse(
      recommendation.readOnlyKey,
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPropmt },
      ],
    );
    return response;
  }
}
