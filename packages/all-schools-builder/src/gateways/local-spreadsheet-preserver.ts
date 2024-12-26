import * as XLSX from "xlsx";
import { spreadsheetHeaders, SpreadsheetRow } from "../domains/spreadsheet";
import { ISpreadsheetPreserver } from "../ports/spreadsheet-preserver";

export class LocalSpreadsheetPreserver implements ISpreadsheetPreserver {
  private spreadsheetPath: string;

  public constructor(spreadsheetPath: string) {
    this.spreadsheetPath = spreadsheetPath;
  }

  public async preserve(schools: SpreadsheetRow[]): Promise<void> {
    const book = XLSX.utils.book_new();
    const sheetHeaders = Object.keys(spreadsheetHeaders);
    const sheet = XLSX.utils.json_to_sheet(schools, { header: sheetHeaders });
    Object.values(spreadsheetHeaders).forEach((v, i) => {
      sheet[`${"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i]}1`] = v;
    });
    XLSX.utils.book_append_sheet(book, sheet);
    XLSX.writeFile(book, this.spreadsheetPath);
  }
}
