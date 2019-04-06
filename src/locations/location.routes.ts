import * as express from "express";

import loc from "./locations.controller";

import { ILocationModel } from "../models/location";

class Locations {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.router.route("/");

    this.router.get("/:id", async (req, res) => {
      try {
        const location: ILocationModel | Error = await loc.getLocation(req.params.id);
        res.status(200).json({
          location
        });
      } catch (error) {
        res.status(400).json({
          error
        });
      }
      
    });

    this.router.post("/new", async (req, res) => {
      try {
        const location: ILocationModel | Error = await loc.newLocation(
          req.body
        );
        res.status(200).json({
          location
        });
      } catch (error) {
        res.status(400).json({
          error
        });
      }
    });
  }
};

export default new Locations().router;
