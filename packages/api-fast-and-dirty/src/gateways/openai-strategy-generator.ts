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
    const systemPrompt = `You are a high school education consultant with great experience specially in consulting people who lived ${systemLocation} and have a client who wants to be in ${school.name} that is located in ${schoolAddr}`;
    const userPropmt = `My child's address is ${addrString}. And child has these interests: ${recommendation.interests.join(", ")}. And here is additional information to consider:
---
${recommendation.additionalInfo}
---
The client wants to be in ${school.name} that is located in ${schoolAddr}. Write meaningful description for school including information about programs, student demographics, admission criteria and graduation rate. Add specific recommendation about what this kid can do to be invited to this school given his current situation.`;
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
