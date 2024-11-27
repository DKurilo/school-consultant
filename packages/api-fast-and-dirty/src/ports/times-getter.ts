import { Coords } from "@school-consultant/common";

export type Time = number | undefined;

export type Mode = "walk" | "car" | "transport";

export interface ITimesGetter {
  getTimes: (from: Coords[], to: Coords[], mode: Mode) => Promise<Time[][]>;
}
