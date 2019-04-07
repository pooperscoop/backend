import { Document, Schema, Model, model } from "mongoose";
import { Doc } from "../interfaces/doc";
import { ICity } from "../interfaces/city";

export interface ICityModel extends ICity, Doc, Document {
  removeLocation(id: string, from: string, to?: string): boolean | Error;
}

export const CitySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    locations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Locations"
      }
    ],
    accepted: [
      {
        type: Schema.Types.ObjectId,
        ref: "Locations"
      }
    ]
  },
  {
    timestamps: true
  }
);

CitySchema.methods.removeLocation = function(
  id: string,
  from: string,
  to: string = null
) {
  return new Promise<Boolean | Error>(async (resolve, reject) => {
    try {
      const newArray = this[from].filter((loc: string) => {
        return loc.toString() !== id;
      });

      this[from] = newArray;

      if (to !== null) {
        this[to].push(id);
      }

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

const CityModel: Model<ICityModel> = model<ICityModel>("Cities", CitySchema);

export default CityModel;
