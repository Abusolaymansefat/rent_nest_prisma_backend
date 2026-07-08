export interface ICreateProperty {
  title: string;
  description: string;
  location: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  propertyType: string;
  images: string[];
  amenities: string[];
  categoryId?: string;
  category?: string;
}

export interface IUpdateRentalRequest {
  status: "APPROVED" | "REJECTED";
}