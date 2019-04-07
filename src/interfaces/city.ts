import { ILocationModel } from "../models/location";

export interface ICity {
  name: string;
  locations?: [string]
  accepted?: [ILocationModel]
}