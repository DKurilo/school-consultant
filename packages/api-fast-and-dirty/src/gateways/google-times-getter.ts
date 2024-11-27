import { Coords } from "@school-consultant/common";
import { GoogleApiDriver } from "../drivers/google-api-driver";
import { ITimesGetter, Mode, Time } from "../ports/times-getter";
import { TravelMode } from "@googlemaps/google-maps-services-js";

export class GoogleTimesGetter implements ITimesGetter {
  private googleDriver: GoogleApiDriver;

  public constructor(googleDriver: GoogleApiDriver) {
    this.googleDriver = googleDriver;
  }

  private modeToTravelMode(mode: Mode): TravelMode {
    if (mode === "walk") {
      return TravelMode.walking;
    }
    if (mode === "transport") {
      return TravelMode.transit;
    }
    return TravelMode.driving;
  }

  public async getTimes(
    from: Coords[],
    to: Coords[],
    mode: Mode,
  ): Promise<Time[][]> {
    const googleMode: TravelMode = this.modeToTravelMode(mode);
    return this.googleDriver.getTimes(from, to, googleMode);
  }
}
