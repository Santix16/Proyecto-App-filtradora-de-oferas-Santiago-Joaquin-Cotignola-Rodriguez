export interface Offer {
  id: string;
  productId: string;
  storeId: string;
  discount: number;
  originalPrice: number;
  finalPrice: number;
  startDate: Date;
  endDate: Date;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
