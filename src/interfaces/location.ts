export interface ILocation {
  submittedBy: string;
  imageURL: string;
  coordinates: {
    longitude: string;
    latitude: string;
  };
  cityID: string;
  acceptedAt?: Date;
  rejectedAt?: Date;
}

export interface ILocationBody {
  submittedBy: string;
  imageURL: string;
  longitude: string;
  latitude: string;
}
