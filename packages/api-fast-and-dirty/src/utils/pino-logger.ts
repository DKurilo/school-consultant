import { pino } from "pino";
import { ILogger } from "../ports/logger";

export const mkLogger = (): ILogger => pino({ level: "debug" });
