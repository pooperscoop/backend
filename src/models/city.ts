import { Document, Schema, Model, model } from "mongoose";
import { Doc } from "../interfaces/doc";
import { ICity } from "../interfaces/city";

export interface ICityModel extends ICity, Doc, Document {}

export const LocationSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  locations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Locations"
    }
  ]
},
{
  timestamps: true
});

const UserModel: Model<ICityModel> = model<ICityModel>(
  "Cities",
  LocationSchema
);

export default UserModel;
