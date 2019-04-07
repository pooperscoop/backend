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
exports.default = new LocationController();
//# sourceMappingURL=locations.controller.js.map