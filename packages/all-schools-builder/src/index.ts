import dotenv from "dotenv";
import { resolve } from "node:path";
import z from "zod";
import { ExportSchools } from "./usecases/export-schools";
import { MyschoolsNycDataLoader } from "./gateways/myschools-nyc-data-loader";
import { mkQueue } from "./utils/queue";
import { Console } from "./controllers/console";
import { IDataLoader } from "./ports/data-loader";
import { ISchoolGetter } from "./ports/school-getter";
import { FsSchoolGetter } from "./gateways/fs-school-getter";
import { ISchoolPreserver } from "./ports/school-preserver";
import { FsSchoolPreserver } from "./gateways/fs-school-preserver";
import { IDataActivator } from "./ports/data-activator";
import { FsDataActivator } from "./gateways/fs-data-activator";
import { ISpreadsheetPreserver } from "./ports/spreadsheet-preserver";
import { LocalSpreadsheetPreserver } from "./gateways/local-spreadsheet-preserver";
import { IMapPreserver } from "./ports/map-preserver";
import { FsMapPreserver } from "./gateways/fs-map-preserver";
import { FsDataLoader } from "./gateways/fs-data-loader";

const ConfigParser = z.object({
  SCHOOLS_3K_SOURCE_URL: z.string(),
  SCHOOLS_PREK_SOURCE_URL: z.string(),
  SCHOOLS_K_SOURCE_URL: z.string(),
  SPREADSHEET_DESTINATION_PATH: z.string(),
  JSON_DESTINATION_FOLDER: z.string(),
  JSON_ACTIVE_PREFIX: z.string(),
  MAP_DESTINATION_PATH: z.string(),
  MYSCHOOLS_NYC_LINK_PREFIX: z.string(),
  // queue settings
  SIMULTANEOUS_REQUESTS_NUMBER: z.coerce.number(),
  DELAY_WHEN_FAILED_MS: z.coerce.number(),
  MAX_REPEATS: z.coerce.number(),
});

type Config = z.infer<typeof ConfigParser>;

const main = async () => {
  const ENV = process.env?.NODE_ENV ?? "development";
  dotenv.config({
    path: resolve(process.cwd(), `.env.${ENV}`),
  });
  const conf: Config = ConfigParser.parse(process.env);
  const spreadsheetDestinationPath =
    conf.SPREADSHEET_DESTINATION_PATH.startsWith(".")
      ? resolve(__dirname, "..", conf.SPREADSHEET_DESTINATION_PATH)
      : conf.SPREADSHEET_DESTINATION_PATH;
  const jsonDestinationFolder = conf.JSON_DESTINATION_FOLDER.startsWith(".")
    ? resolve(__dirname, "..", conf.JSON_DESTINATION_FOLDER)
    : conf.JSON_DESTINATION_FOLDER;
  const mapDestinationPath = conf.MAP_DESTINATION_PATH.startsWith(".")
    ? resolve(__dirname, "..", conf.MAP_DESTINATION_PATH)
    : conf.MAP_DESTINATION_PATH;
  const queue = mkQueue(
    conf.SIMULTANEOUS_REQUESTS_NUMBER,
    conf.DELAY_WHEN_FAILED_MS,
    conf.MAX_REPEATS,
  );
  const threeKDataLoader: IDataLoader = new MyschoolsNycDataLoader(
    conf.SCHOOLS_3K_SOURCE_URL,
    queue,
  );
  const preKDataLoader: IDataLoader = new MyschoolsNycDataLoader(
    conf.SCHOOLS_PREK_SOURCE_URL,
    queue,
  );
  const kDataLoader: IDataLoader = new MyschoolsNycDataLoader(
    conf.SCHOOLS_K_SOURCE_URL,
    queue,
  );
  const schoolGetter: ISchoolGetter = new FsSchoolGetter(jsonDestinationFolder);
  const schoolPreserver: ISchoolPreserver = new FsSchoolPreserver(
    jsonDestinationFolder,
  );
  const dataActivator: IDataActivator = new FsDataActivator(
    jsonDestinationFolder,
    conf.JSON_ACTIVE_PREFIX,
  );
  const spreadsheetPreserver: ISpreadsheetPreserver =
    new LocalSpreadsheetPreserver(spreadsheetDestinationPath);
  const mapPreserver: IMapPreserver = new FsMapPreserver(mapDestinationPath);
  const exportSchoolsUsecase = new ExportSchools({
    linkPrefix: conf.MYSCHOOLS_NYC_LINK_PREFIX,
    threeKDataLoader,
    preKDataLoader,
    kDataLoader,
    schoolGetter,
    schoolPreserver,
    dataActivator,
    spreadsheetPreserver,
    mapPreserver,
  });
  const threeKFsDataLoader: IDataLoader = new FsDataLoader(
    conf.JSON_DESTINATION_FOLDER,
    conf.JSON_ACTIVE_PREFIX,
    "threeK",
  );
  const preKFsDataLoader: IDataLoader = new FsDataLoader(
    conf.JSON_DESTINATION_FOLDER,
    conf.JSON_ACTIVE_PREFIX,
    "preK",
  );
  const kFsDataLoader: IDataLoader = new FsDataLoader(
    conf.JSON_DESTINATION_FOLDER,
    conf.JSON_ACTIVE_PREFIX,
    "k",
  );
  const exportTransformSchoolsUsecase = new ExportSchools({
    linkPrefix: conf.MYSCHOOLS_NYC_LINK_PREFIX,
    threeKDataLoader: threeKFsDataLoader,
    preKDataLoader: preKFsDataLoader,
    kDataLoader: kFsDataLoader,
    schoolGetter,
    schoolPreserver,
    dataActivator,
    spreadsheetPreserver,
    mapPreserver,
  });
  const app = new Console(exportSchoolsUsecase, exportTransformSchoolsUsecase);
  await app.run();
};

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
