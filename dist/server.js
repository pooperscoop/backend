"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth_controller_1 = require("./auth/auth.controller");
const auth_routes_1 = require("./auth/auth.routes");
const location_routes_1 = require("./locations/location.routes");
class Server {
    constructor() {
        this.server = express();
        this.connectDb();
        this.applyMiddleware();
        this.mountRoutes();
    }
    connectDb() {
        const mongo = process.env.MONGO_URI;
        mongoose.connect(mongo, {
            useNewUrlParser: true,
            useCreateIndex: true
        });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB Connection error'));
    }
    applyMiddleware() {
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({ extended: true }));
        this.server.use(auth_controller_1.default.authenticate);
        this.server.use(cors());
    }
    mountRoutes() {
        this.server.use('/auth', auth_routes_1.default);
        this.server.use('/loc', location_routes_1.default);
    }
}
exports.default = new Server().server;
//# sourceMappingURL=server.js.map