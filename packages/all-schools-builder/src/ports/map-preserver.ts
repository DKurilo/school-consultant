import { SchoolInfo } from "../domains/school-info";
import { SpreadsheetRow } from "../domains/spreadsheet";

export interface IMapPreserver {
  preserve: (schools: (SpreadsheetRow | SchoolInfo)[]) => Promise<void>;
}
