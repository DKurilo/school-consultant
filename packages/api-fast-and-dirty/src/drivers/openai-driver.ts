import OpenAI from "openai";
import { ILogger } from "../ports/logger";

export class OpenaiDriver {
  private logger: ILogger;
  private client: OpenAI;
  private model: OpenAI.Chat.ChatModel = "gpt-4o-mini";

  public constructor(
    logger: ILogger,
    organization: string,
    project: string,
    secret: string,
  ) {
    this.logger = logger;
    this.client = new OpenAI({
      organization,
      project,
      apiKey: secret,
    });
  }

  public async getResponse(
    userKey: string,
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  ): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      user: userKey,
      messages,
    });
    if (!response.choices[0].message.content) {
      this.logger.error(
        "something goes wrong while using OpenAI, response",
        response,
      );
      throw new Error("OpenAI: wrng response");
    }
    return response.choices[0].message.content;
  }
}
