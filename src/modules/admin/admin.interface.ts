import {
  UserStatus,
  PropertyAvailability,
  RentalStatus,
} from "../../../generated/prisma/enums";

export interface IUpdateUserStatus {
  status?: UserStatus;
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface IUserQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  status?: UserStatus;
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