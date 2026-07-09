import { RentalStatus } from "../../../generated/prisma/enums";

export interface ICreateRentalRequest {
      propertyId: string;
      moveInDate: Date | string;
      message?: string;
      duration?: number;
}

export interface IUpdateRentalRequest {
      status: RentalStatus;
}



export interface IRentalQuery {
      page?: number;
      limit?: number;
      status?: RentalStatus;
}

export interface IRentalResponse {
      id: string;
      propertyId: string;
      tenantId: string;
      landlordId: string;

      moveInDate: Date;

      message?: string | null;

      status: RentalStatus;

      createdAt: Date;
      updatedAt: Date;
}

