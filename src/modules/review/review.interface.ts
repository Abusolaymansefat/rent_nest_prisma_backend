export interface ICreateReview {
  rentalRequestId: string;
  propertyId: string;
  rating: number;
  comment: string;
}

export interface IUpdateReview {
  rating?: number;
  comment?: string;
}

export interface IReviewQuery {
  page?: number;
  limit?: number;
  propertyId?: string;
}

export interface IReviewResponse {
  id: string;

  tenantId: string;
  propertyId: string;
  rentalRequestId: string;

  rating: number;
  comment: string;

  createdAt: Date;
  updatedAt: Date;
}