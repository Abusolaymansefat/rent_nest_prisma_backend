import {
  UserStatus,
  PropertyAvailability,
  RentalStatus,
} from "../../../generated/prisma/enums";

export interface IUpdateUserStatus {
  activeStatus: UserStatus;
}

/**
 * User Query
 */
export interface IUserQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  activeStatus?: UserStatus;
}

/**
 * Property Query
 */
export interface IPropertyQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  location?: string;
  availability?: PropertyAvailability;
}

/**
 * Rental Query
 */
export interface IRentalQuery {
  page?: number;
  limit?: number;
  status?: RentalStatus;
}

/**
 * Dashboard Statistics (Optional)
 */
export interface IAdminDashboard {
  totalUsers: number;
  totalLandlords: number;
  totalTenants: number;
  totalProperties: number;
  totalRentals: number;
  totalCompletedRentals: number;
}