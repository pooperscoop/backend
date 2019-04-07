export interface ILocation {
  submittedBy: string;
  imageURL: string;
  longitude: string;
  latitude: string;
  cityID: string;
  acceptedAt?: Date;
  rejectedAt?: Date;
}
