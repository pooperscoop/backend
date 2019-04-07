"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const location_1 = require("../models/location");
const city_1 = require("../models/city");
class LocationController {
    getLocation(id) {
        return new Promise((resolve, reject) => {
            try {
                location_1.default.findById(id, (err, location) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(location);
                    }
                });
            }
            catch (error) { }
        });
    }
    getCity(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const city = yield city_1.default.findById(id)
                    .populate("locations")
                    .populate("accepted");
                resolve(city);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    newCity(body) {
        return new Promise((resolve, reject) => {
            const { name } = body;
            const newCity = new city_1.default({
                name
            });
            newCity.save((err, city) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(city);
                }
            });
        });
    }
    accept(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield location_1.default.findById(id);
                location.acceptedAt = new Date();
                yield location.save();
                const city = yield city_1.default.findById(location.cityID);
                city.removeLocation(id, "locations", "accepted");
                yield city.save();
                resolve(id);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    reject(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield location_1.default.findById(id);
                location.rejectedAt = new Date();
                yield location.save();
                const city = yield city_1.default.findById(location.cityID);
                city.removeLocation(id, "locations");
                yield city.save();
                resolve(id);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    getRoute(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const city = yield city_1.default.findById(id).populate("accepted");
                const workingArray = city.accepted;
                const origin = city.accepted[0];
                workingArray.shift;
                const distanceArray = workingArray.map((loc, index) => {
                    const dist = distance(origin.coordinates, loc.coordinates);
                    return {
                        dist,
                        index: index + 1
                    };
                });
                const sorted = distanceArray.sort((a, b) => {
                    var keyA = a.dist, keyB = b.dist;
                    // Compare the 2 dates
                    if (keyA < keyB)
                        return -1;
                    if (keyA > keyB)
                        return 1;
                    return 0;
                });
                const tenClosest = [origin];
                for (let i = 0; i < 10; i++) {
                    if (i >= sorted.length - 1) {
                        break;
                    }
                    else {
                        tenClosest.push(city.accepted[sorted[i].index]);
                    }
                }
                resolve(tenClosest);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    newLocation(body, cityID) {
        return new Promise((resolve, reject) => {
            if (cityID === null) {
                reject(new Error("No city id provided."));
            }
            else {
                const { submittedBy, imageURL, longitude, latitude } = body;
                const coordinates = {
                    longitude,
                    latitude
                };
                const newLocation = new location_1.default({
                    submittedBy,
                    imageURL,
                    coordinates,
                    cityID
                });
                newLocation.save((err, location) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        city_1.default.findById(cityID, (err, city) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                city.locations.push(location._id);
                                city.save((err) => {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
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
function distance(position1, position2) {
    var lat1 = parseFloat(position1.latitude);
    var lat2 = parseFloat(position2.latitude);
    var lon1 = parseFloat(position1.longitude);
    var lon2 = parseFloat(position2.longitude);
    var R = 6371000; // metres
    var φ1 = toRadians(lat1);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians(lat2 - lat1);
    var Δλ = toRadians(lon2 - lon1);
    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}
function toRadians(val) {
    return (val * Math.PI) / 180;
}
exports.default = new LocationController();
//# sourceMappingURL=locations.controller.js.map