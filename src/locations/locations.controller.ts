import Location, { ILocationModel } from "../models/location";

class LocationController {

  public async getLocation(id: String): Promise<ILocationModel | null> {
    return new Promise<ILocationModel | null>((resolve, reject) => {
      try {
        Location.findById(id, (err: Error, location: ILocationModel) => {
          if (err) {
            reject(err);
          } else {
            resolve(location);
          }
        })
      } catch (error) {

      }
    });
  }

  public async newLocation(body: ILocationModel): Promise<ILocationModel | Error> {
    return new Promise<ILocationModel | Error>((resolve, reject) => {
      const { submittedBy, imageURL, longitude, latitude } = body;
      const coordinates = {
        longitude,
        latitude
      }

      const newLocation = new Location({
        submittedBy,
        imageURL,
        coordinates
      });

      newLocation.save((err: Error, location: ILocationModel) => {
        if (err) {
          reject(err);
        } else {
          resolve(location);
        }
      });
    });
  }
}

export default new LocationController();
