export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  openingHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  rating?: number;
  reviews?: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
