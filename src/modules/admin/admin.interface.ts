import {
  UserStatus,
  PropertyAvailability,
  RentalStatus,
} from "../../../generated/prisma/enums";

export interface IUpdateUserStatus {
  activeStatus: UserStatus;
}

export interface IUserQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  activeStatus?: UserStatus;
}


export interface IPropertyQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  location?: string;
  availability?: PropertyAvailability;
}


export interface IRentalQuery {
  page?: number;
  limit?: number;
  status?: RentalStatus;
}


export interface IAdminDashboard {
  totalUsers: number;
  totalLandlords: number;
  totalTenants: number;
  totalProperties: number;
  totalRentals: number;
  totalCompletedRentals: number;
}