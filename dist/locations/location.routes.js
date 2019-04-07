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
const express = require("express");
const locations_controller_1 = require("./locations.controller");
class Locations {
    constructor() {
        this.router = express.Router();
        this.router.route("/");
        this.router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield locations_controller_1.default.getLocation(req.params.id);
                res.status(200).json({
                    location
                });
            }
            catch (error) {
                res.status(400).json({
                    error
                });
            }
        }));
        this.router.get("/city/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const city = yield locations_controller_1.default.getCity(req.params.id);
                res.status(200).json({
                    city
                });
            }
            catch (error) {
                res.status(400).json({
                    error
                });
            }
        }));
        this.router.get("/route/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const route = yield locations_controller_1.default.getRoute(req.params.id);
                res.status(200).json({
                    route
                });
            }
            catch (error) {
                res.status(400).json({
                    error
                });
            }
        }));
        this.router.post("/newCity", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const city = yield locations_controller_1.default.newCity(req.body);
                res.status(200).json({
                    city
                });
            }
            catch (error) {
                res.status(400).json({
                    error
                });
            }
        }));
        this.router.get("/accept/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield locations_controller_1.default.accept(req.params.id);
                res.status(200).json({
                    location
                });
            }
            catch (error) {
                res.status(400).json({
                    error
                });
            }
        }));
        this.router.get("/reject/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield locations_controller_1.default.reject(req.params.id);
                res.status(200).json({
                    location
                });
            }
            catch (error) {
                res.status(400).json({
                    error
                });
            }
        }));
        this.router.post("/new", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const cityID = req.get("cityID") ? req.get("cityID") : null;
            try {
                const location = yield locations_controller_1.default.newLocation(req.body, cityID);
                res.status(200).json({
                    location
                });
            }
            catch (error) {
                res.status(400).json({
                    error
                });
            }
        }));
    }
}
exports.default = new Locations().router;
//# sourceMappingURL=location.routes.js.map