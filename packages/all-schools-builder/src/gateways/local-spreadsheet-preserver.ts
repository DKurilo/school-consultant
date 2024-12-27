import fs from "node:fs/promises";
import Excel from "exceljs";
import { spreadsheetHeaders, SpreadsheetRow } from "../domains/spreadsheet";
import { ISpreadsheetPreserver } from "../ports/spreadsheet-preserver";

const boolToYesNo = (v: boolean): string => (v ? "yes" : "no");

const prepareWebsite = (v: string): string => {
  if (v.startsWith("http")) {
    return v;
  }
  return `https://${v}`;
};

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

    const colWidths = [
      14, 14, 30, 14, 30, 30, 30, 30, 15, 15, 20, 12, 12, 12, 12,
    ];
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
          borough: s.borough,
          zone: s.zone,
          name: s.name,
          gradesDescription: s.gradesDescription,
          dbn: s.dbn,
          link: s.link,
          address: s.address ?? "",
          mapLink: s.mapLink ?? "",
          email: s.email ?? "",
          phone: s.phone ?? "",
          website: s.website ?? "",
          uniform: s.uniform === undefined ? "" : boolToYesNo(s.uniform),
          threeK: boolToYesNo(s.threeK),
          preK: boolToYesNo(s.preK),
          k: boolToYesNo(s.k),
        },
        "n",
      );
      const row = sheet.getRow(i + 2);
      // borough
      row.getCell(1).alignment = { horizontal: "center" };
      // zone
      row.getCell(2).alignment = { horizontal: "center" };
      // gradesDescription
      row.getCell(4).alignment = { horizontal: "center" };
      // dbn
      row.getCell(5).alignment = { horizontal: "center" };
      // link
      row.getCell(6).value = {
        text: s.link,
        hyperlink: s.link,
      };
      // mapLink
      if (s.mapLink) {
        row.getCell(7).value = {
          text: s.mapLink,
          hyperlink: s.mapLink,
        };
      }
      // email
      if (s.email) {
        row.getCell(8).value = {
          text: s.email,
          hyperlink: `mailto:${s.email}`,
        };
      }
      // website
      if (s.website && s.website.length > 0) {
        row.getCell(11).value = {
          text: s.website,
          hyperlink: prepareWebsite(s.website),
        };
      }
      // uniform
      row.getCell(12).alignment = { horizontal: "center" };
      // threeK
      row.getCell(13).alignment = { horizontal: "center" };
      // preK
      row.getCell(14).alignment = { horizontal: "center" };
      // k
      row.getCell(15).alignment = { horizontal: "center" };

      if (s.threeK && s.preK && s.k) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffffbf00" },
        };
      }
    });
    sheet.autoFilter = "A1:O1";

    const stream = await fs.open(this.spreadsheetPath, "w");
    await book.xlsx.write(stream.createWriteStream());
    await stream.close();
  }
}
