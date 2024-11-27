import { Address, Coords } from "@school-consultant/common";

export interface ICoordsGetter {
  getCoords: (address: Address) => Promise<Coords>;
}
