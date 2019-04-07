import Location, { ILocationModel } from "../models/location";
import City, { ICityModel } from "../models/city";

class LocationController {
  public getLocation(id: String): Promise<ILocationModel | null> {
    return new Promise<ILocationModel | null>((resolve, reject) => {
      try {
        Location.findById(id, (err: Error, location: ILocationModel) => {
          if (err) {
            reject(err);
          } else {
            resolve(location);
          }
        });
      } catch (error) {}
    });
  }

  public newCity(body: ICityModel): Promise<ICityModel | Error> {
    return new Promise<ICityModel | Error>((resolve, reject) => {
      const { name } = body;

      const newCity = new City({
        name
      });

      newCity.save((err: Error, city: ICityModel) => {
        if (err) {
          reject(err);
        } else {
          resolve(city);
        }
      });
    });
  }

  public accept(id: string): Promise<string | Error> {
    return new Promise<string | Error>(async (resolve, reject) => {
      try {
        const location = await Location.findById(id);
        location.acceptedAt = new Date();
        await location.save();

        const city = await City.findById(location.cityID);
        city.removeLocation(id, "locations", "accepted");
        await city.save();

        resolve(id);
      } catch (error) {
        reject(error);
      }
    });
  }

  public reject(id: string): Promise<string | Error> {
    return new Promise<string | Error>(async (resolve, reject) => {
      try {
        const location = await Location.findById(id);
        location.rejectedAt = new Date();
        await location.save();

        const city = await City.findById(location.cityID);
        city.removeLocation(id, "locations");
        await city.save();

        resolve(id);
      } catch (error) {
        reject(error);
      }
    });
  }

  public newLocation(
    body: ILocationModel,
    cityID: String
  ): Promise<ILocationModel | Error> {
    return new Promise<ILocationModel | Error>((resolve, reject) => {
      if (cityID === null) {
        reject(new Error("No city id provided."));
      } else {
        const { submittedBy, imageURL, longitude, latitude } = body;
        const coordinates = {
          longitude,
          latitude
        };

        const newLocation = new Location({
          submittedBy,
          imageURL,
          coordinates,
          cityID
        });

        newLocation.save((err: Error, location: ILocationModel) => {
          if (err) {
            reject(err);
          } else {
            City.findById(cityID, (err: Error, city: ICityModel) => {
              if (err) {
                reject(err);
              } else {
                city.locations.push(location._id);
                city.save((err: Error) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(location);
                  }
                });
              }
            });
          }
        });
      }
    });
  }
}

export default new LocationController();
