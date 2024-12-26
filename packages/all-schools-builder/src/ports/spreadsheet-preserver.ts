import { SpreadsheetRow } from "../domains/spreadsheet";

export interface ISpreadsheetPreserver {
  preserve: (schools: SpreadsheetRow[]) => Promise<void>;
}
