import { prisma } from "../../lib/prisma";
import {
      IUserQuery,
      IPropertyQuery,
      IRentalQuery,
      IUpdateUserStatus,
} from "./admin.interface";

const MAX_LIMIT = 100;

const getAllUsers = async (query: IUserQuery) => {
      const page = Math.max(Number(query.page) || 1, 1);
      const limit = Math.min(Number(query.limit) || 10, MAX_LIMIT);
      const skip = (page - 1) * limit;

      const where: any = {};

      if (query.role) {
            where.role = query.role;
      }

      if (query.status) {
            where.status = query.status;   // activeStatus না
      }

      if (query.searchTerm) {
            where.OR = [
                  { name: { contains: query.searchTerm, mode: "insensitive" } },
                  { email: { contains: query.searchTerm, mode: "insensitive" } },
            ];
      }

      const users = await prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  avatar: true,
                  role: true,
                  status: true,   // activeStatus না
                  createdAt: true,
            },
      });

      const total = await prisma.user.count({ where });

      return { meta: { page, limit, total }, data: users };
};

const updateUserStatus = async (
      id: string,
      payload: IUpdateUserStatus
) => {
      if (!payload) {
            throw { statusCode: 400, message: "Payload is required" };
      }

      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
            throw { statusCode: 404, message: "User not found" };
      }

      if (user.role === "ADMIN") {
            throw { statusCode: 400, message: "Cannot update an admin account" };
      }

      const data: any = {};

      if (payload.status !== undefined) {
            data.status = payload.status;
      }

      if (payload.name !== undefined) {
            data.name = payload.name;
      }

      if (payload.phone !== undefined) {
            data.phone = payload.phone;
      }

      if (payload.avatar !== undefined) {
            data.avatar = payload.avatar;
      }

      if (Object.keys(data).length === 0) {
            throw { statusCode: 400, message: "At least one field must be provided for update" };
      }

      return prisma.user.update({
            where: { id },
            data,
      });
};

const getAllProperties = async (query: IPropertyQuery) => {
      const page = Math.max(Number(query.page) || 1, 1);
      const limit = Math.min(Number(query.limit) || 10, MAX_LIMIT);
      const skip = (page - 1) * limit;

      const where: any = {};

      if (query.location) {
            where.location = { contains: query.location, mode: "insensitive" };
      }

      if (query.availability) {
            where.availability = query.availability;
      }

      if (query.searchTerm) {
            where.title = { contains: query.searchTerm, mode: "insensitive" };
      }

      const properties = await prisma.property.findMany({
            where,
            skip,
            take: limit,
            include: { landlord: true, category: true },
            orderBy: { createdAt: "desc" },
      });

      const total = await prisma.property.count({ where });

      return {
            meta: { page, limit, total },
            data: properties,
      };
};

const getAllRentals = async (query: IRentalQuery) => {
      const page = Math.max(Number(query.page) || 1, 1);
      const limit = Math.min(Number(query.limit) || 10, MAX_LIMIT);
      const skip = (page - 1) * limit;

      const where: any = {};

      if (query.status) {
            where.status = query.status;
      }

      const rentals = await prisma.rentalRequest.findMany({
            where,
            skip,
            take: limit,
            include: { tenant: true, landlord: true, property: true },
            orderBy: { createdAt: "desc" },
      });

      const total = await prisma.rentalRequest.count({ where });

      return {
            meta: { page, limit, total },
            data: rentals,
      };
};

const getDashboardStats = async () => {
      const [
            totalUsers,
            totalLandlords,
            totalTenants,
            totalProperties,
            totalRentals,
            totalCompletedRentals,
      ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: "LANDLORD" } }),
            prisma.user.count({ where: { role: "TENANT" } }),
            prisma.property.count(),
            prisma.rentalRequest.count(),
            prisma.rentalRequest.count({ where: { status: "COMPLETED" } }),
      ]);

      return {
            totalUsers,
            totalLandlords,
            totalTenants,
            totalProperties,
            totalRentals,
            totalCompletedRentals,
      };
};

export const AdminService = {
      getAllUsers,
      updateUserStatus,
      getAllProperties,
      getAllRentals,
      getDashboardStats,
};