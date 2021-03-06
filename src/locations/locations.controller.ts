import Location, { ILocationModel } from "../models/location";
import City, { ICityModel } from "../models/city";

import { ILocationBody } from "../interfaces/location";

class LocationController {
  public getLocation(id: string): Promise<ILocationModel | null> {
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

  public getCity(id: string): Promise<ICityModel | Error> {
    return new Promise<ICityModel | Error>(async (resolve, reject) => {
      try {
        const city = await City.findById(id)
          .populate("locations")
          .populate("accepted");
        resolve(city);
      } catch (error) {
        reject(error);
      }
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

  public getRoute(id: string): Promise<ILocationModel[] | Error> {
    return new Promise<ILocationModel[] | Error>(async (resolve, reject) => {
      try {
        const city = await City.findById(id).populate("accepted");
        const workingArray = city.accepted;
        const origin: ILocationModel = city.accepted[0];
        workingArray.shift;

        const distanceArray = workingArray.map(
          (loc: ILocationModel, index: number) => {
            const dist = distance(origin.coordinates, loc.coordinates);
            return {
              dist,
              index: index + 1
            };
          }
        );

        const sorted = distanceArray.sort((a, b) => {
          var keyA = a.dist,
            keyB = b.dist;
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });

        const tenClosest = [origin];
        for (let i = 0; i < 10; i++) {
          if (i >= sorted.length - 1) {
            break;
          } else {
            tenClosest.push(city.accepted[sorted[i].index]);
          }
        }

        resolve(tenClosest);
      } catch (error) {
        reject(error);
      }
    });
  }

  public newLocation(
    body: ILocationBody,
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

// helpers

// https://stackoverflow.com/questions/29118745/get-nearest-latitude-and-longitude-from-array
function distance(
  position1: { latitude: string; longitude: string },
  position2: { latitude: string; longitude: string }
): number {
  var lat1 = parseFloat(position1.latitude);
  var lat2 = parseFloat(position2.latitude);
  var lon1 = parseFloat(position1.longitude);
  var lon2 = parseFloat(position2.longitude);
  var R = 6371000; // metres
  var φ1 = toRadians(lat1);
  var φ2 = toRadians(lat2);
  var Δφ = toRadians(lat2 - lat1);
  var Δλ = toRadians(lon2 - lon1);

  var a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  var d = R * c;
  return d;
}

function toRadians(val: number): number {
  return (val * Math.PI) / 180;
}

export default new LocationController();
