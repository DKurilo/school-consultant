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
    const systemPrompt = `You are a high school education consultant with great experience specially in consulting people who lived ${systemLocation}. Also you are perfect psychologist that mostly works with teenagers. Your task is to build personalized report with information about ${school.name} that is located in ${schoolAddr}. The report should include meaningful description for school including information about programs, student demographics, admission criteria and graduation rate. Add specific recommendation about what this kid can do to be invited to this school given his current situation. Also build list of questions and sentences that can motivate the kid to prepare better for school.`;
    const userPropmt = `My child's address is ${addrString}. And child has these interests: ${recommendation.interests.join(", ")}. And here is additional information to consider:
---
${recommendation.additionalInfo}
---
The child want to join ${school.name} that is located in ${schoolAddr}. Can you help us, please?`;
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
