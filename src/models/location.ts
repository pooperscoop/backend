import { Document, Schema, Model, model } from "mongoose";
import { Doc } from "../interfaces/doc";
import { ILocation } from "../interfaces/location";

export interface ILocationModel extends ILocation, Doc, Document {}

export const LocationSchema: Schema = new Schema({
  submittedBy: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  },
  coordinates: {
    longitude: {
      type: String,
      required: true
    },
    latitude: {
      type: String,
      required: true
    }
  },
  cityID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Cities"
  }
},
{
  timestamps: true
});

const UserModel: Model<ILocationModel> = model<ILocationModel>(
  "Locations",
  LocationSchema
);

export default UserModel;
