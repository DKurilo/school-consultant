import { GoogleApiDriver } from "../drivers/google-api-driver";
import { ICoordsGetter } from "../ports/coords-getter";
import { ILogger } from "../ports/logger";
import { Address, Coords } from "@school-consultant/common";

export class GoogleCoordsGetter implements ICoordsGetter {
  private logger: ILogger;
  private googleDriver: GoogleApiDriver;

  public constructor(logger: ILogger, googleDriver: GoogleApiDriver) {
    this.logger = logger;
    this.googleDriver = googleDriver;
  }

  public async getCoords(address: Address): Promise<Coords> {
    if (address.coords !== undefined) {
      return address.coords;
    }

    try {
      const addrString =
        "zip" in address
          ? `${address.street}, ${address.city}, ${address.state}, ${address.zip}`
          : address.addr;
      const coords = await this.googleDriver.getCoords(addrString);
      return coords;
    } catch (e) {
      this.logger.error(
        `Could not get coords for address ${JSON.stringify(address)}, error ${e}`,
        e,
      );
      throw e;
    }
  }
}
