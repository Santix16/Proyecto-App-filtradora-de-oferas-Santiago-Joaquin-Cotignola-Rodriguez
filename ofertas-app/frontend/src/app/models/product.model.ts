export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  storeId: string;
  storeName: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  reviews?: number;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}
