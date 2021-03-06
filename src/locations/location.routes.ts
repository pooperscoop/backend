import * as express from "express";

import loc from "./locations.controller";

import { ILocationModel } from "../models/location";
import { ICityModel } from "../models/city";

class Locations {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.router.route("/");

    this.router.get("/:id", async (req: any, res) => {
      if (req.user === null) {
        res.status(400).json({
          error: "User must be logged in."
        });
      } else {
        try {
          const location: ILocationModel | Error = await loc.getLocation(
            req.params.id
          );
          res.status(200).json({
            location
          });
        } catch (error) {
          res.status(500).json({
            error
          });
        }
      }
    });

    this.router.get("/city/:id", async (req: any, res) => {
      if (req.user === null) {
        res.status(400).json({
          error: "User must be logged in."
        });
      } else {
        try {
          const city: ICityModel | Error = await loc.getCity(req.params.id);
          res.status(200).json({
            city
          });
        } catch (error) {
          res.status(500).json({
            error
          });
        }
      }
    });

    this.router.get("/route/:id", async (req, res) => {
      try {
        const route = await loc.getRoute(req.params.id);
        res.status(200).json({
          route
        });
      } catch (error) {
        res.status(500).json({
          error
        });
      }
    });

    this.router.post("/newCity", async (req: any, res) => {
      if (req.user === null) {
        res.status(400).json({
          error: "User must be logged in."
        });
      } else {
        try {
          const city: ICityModel | Error = await loc.newCity(req.body);
          res.status(200).json({
            city
          });
        } catch (error) {
          res.status(500).json({
            error
          });
        }
      }
    });

    this.router.get("/accept/:id", async (req: any, res) => {
      if (req.user === null) {
        res.status(400).json({
          error: "User must be logged in."
        });
      } else {
        try {
          const location = await loc.accept(req.params.id);
          res.status(200).json({
            location
          });
        } catch (error) {
          res.status(500).json({
            error
          });
        }
      }
    });

    this.router.get("/reject/:id", async (req: any, res) => {
      if (req.user === null) {
        res.status(400).json({
          error: "User must be logged in."
        });
      } else {
        try {
          const location = await loc.reject(req.params.id);
          res.status(200).json({
            location
          });
        } catch (error) {
          res.status(500).json({
            error
          });
        }
      }
    });

    this.router.post("/new", async (req, res) => {
      const cityID = req.get("cityID") ? req.get("cityID") : null;
      try {
        const location: ILocationModel | Error = await loc.newLocation(
          req.body,
          cityID
        );
        res.status(200).json({
          location
        });
      } catch (error) {
        res.status(500).json({
          error
        });
      }
    });
  }
}

export default new Locations().router;
