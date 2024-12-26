import fs from "node:fs/promises";
import Excel from "exceljs";
import { spreadsheetHeaders, SpreadsheetRow } from "../domains/spreadsheet";
import { ISpreadsheetPreserver } from "../ports/spreadsheet-preserver";

export class LocalSpreadsheetPreserver implements ISpreadsheetPreserver {
  private spreadsheetPath: string;

  public constructor(spreadsheetPath: string) {
    this.spreadsheetPath = spreadsheetPath;
  }

  public async preserve(schools: SpreadsheetRow[]): Promise<void> {
    const book = new Excel.Workbook();
    const sheet = book.addWorksheet("NYC-3K-PreK-K-Schools", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    const colWidths = [14, 30, 30, 30, 12, 12, 12];
    sheet.columns = Object.entries(spreadsheetHeaders).map(([k, v], i) => ({
      header: v,
      key: k,
      width: colWidths?.[i] ?? 10,
    }));
    const headerRow = sheet.getRow(1);
    sheet.headerFooter = { firstHeader: "a" };
    headerRow.alignment = { horizontal: "center" };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "AAAAAA" },
    };
    headerRow.font = { bold: true, family: 1, name: "Calibri" };

    schools.forEach((s, i) => {
      sheet.addRow(
        {
          zone: s.zone,
          name: s.name,
          dbn: s.dbn,
          link: s.link,
          threeK: s.threeK ? "yes" : "no",
          preK: s.preK ? "yes" : "no",
          k: s.k ? "yes" : "no",
        },
        "n",
      );
      sheet.getRow(i + 2).getCell(1).alignment = { horizontal: "center" };
      sheet.getRow(i + 2).getCell(3).alignment = { horizontal: "center" };
      sheet.getRow(i + 2).getCell(4).value = {
        text: s.link,
        hyperlink: s.link,
      };
      sheet.getRow(i + 2).getCell(5).alignment = { horizontal: "center" };
      sheet.getRow(i + 2).getCell(6).alignment = { horizontal: "center" };
      sheet.getRow(i + 2).getCell(7).alignment = { horizontal: "center" };
    }, "n");
    sheet.autoFilter = "A1:G1";

    const stream = await fs.open(this.spreadsheetPath, "w");
    await book.xlsx.write(stream.createWriteStream());
    await stream.close();
  }
}
