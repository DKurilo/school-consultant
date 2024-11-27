import {
  Client,
  LatLng,
  TravelMode,
} from "@googlemaps/google-maps-services-js";
import { ILogger } from "../ports/logger";
import { Coords } from "@school-consultant/common";

export class GoogleApiDriver {
  private logger: ILogger;
  private clientKey: string;
  private client: Client;

  public constructor(logger: ILogger, clientKey: string) {
    this.logger = logger;
    this.clientKey = clientKey;
    this.client = new Client();
  }

  private isGoodStatus(st: number, dataSt: string): boolean {
    return Math.floor(st / 100) === 2 && dataSt === "OK";
  }

  public async getCoords(address: string): Promise<Coords> {
    try {
      const response = await this.client.geocode({
        params: {
          address,
          key: this.clientKey,
        },
      });
      if (!this.isGoodStatus(response.status, response.data.status)) {
        this.logger.error(
          `Error while getting coordinates for ${address}`,
          response,
        );
        throw new Error("can't get coords");
      }
      return {
        latitude: response.data.results[0].geometry.location.lat,
        longitude: response.data.results[0].geometry.location.lng,
      };
    } catch (e) {
      this.logger.error(`google query failed with error: ${e}, {}`, e);
      throw new Error("can't get coords");
    }
  }

  private coordToGoogleCoord(c: Coords): LatLng {
    return {
      lat: c.latitude,
      lng: c.longitude,
    };
  }

  private coordsToGoogleCoords(cs: Coords[]): LatLng[] {
    return cs.map((c) => this.coordToGoogleCoord(c));
  }

  public async getTimes(
    from: Coords[],
    to: Coords[],
    mode: TravelMode,
  ): Promise<(number | undefined)[][]> {
    try {
      const response = await this.client.distancematrix({
        params: {
          origins: this.coordsToGoogleCoords(from),
          destinations: this.coordsToGoogleCoords(to),
          mode,
          key: this.clientKey,
        },
      });
      if (!this.isGoodStatus(response.status, response.data.status)) {
        this.logger.error("Error while getting time", from, to, mode, response);
        throw new Error("can't get time");
      }
      return response.data.rows.map((els) =>
        els.elements.map((el) => {
          if (el.status !== "OK") {
            return undefined;
          }
          return el.duration.value;
        }),
      );
    } catch (e) {
      this.logger.error(`google-driver: getTimes: error: ${e} {}`, e);
      throw e;
    }
  }
}
