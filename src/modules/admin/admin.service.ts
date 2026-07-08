import { prisma } from "../../lib/prisma";
import {
      IUserQuery,
      IPropertyQuery,
      IRentalQuery,
      IUpdateUserStatus,
} from "./admin.interface";

const getAllUsers = async (query: IUserQuery) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (query.role) {
            where.role = query.role;
      }

      if (query.activeStatus) {
            where.activeStatus = query.activeStatus;
      }

      if (query.searchTerm) {
            where.OR = [
                  {
                        name: {
                              contains: query.searchTerm,
                              mode: "insensitive",
                        },
                  },
                  {
                        email: {
                              contains: query.searchTerm,
                              mode: "insensitive",
                        },
                  },
            ];
      }

      const users = await prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                  createdAt: "desc",
            },
            select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  avatar: true,
                  role: true,
                  activeStatus: true,
                  createdAt: true,
            },
      });

      const total = await prisma.user.count({ where });

      return {
            meta: {
                  page,
                  limit,
                  total,
            },
            data: users,
      };
};

const updateUserStatus = async (
      id: string,
      payload: IUpdateUserStatus
) => {
      const user = await prisma.user.findUnique({
            where: { id },
      });

      if (!user) {
            throw new Error("User not found");
      }

      return prisma.user.update({
            where: {
                  id,
            },
            data: {
                  activeStatus: payload.activeStatus,
            },
      });
};

const getAllProperties = async (query: IPropertyQuery) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (query.location) {
            where.location = {
                  contains: query.location,
                  mode: "insensitive",
            };
      }

      if (query.availability) {
            where.availability = query.availability;
      }

      if (query.searchTerm) {
            where.title = {
                  contains: query.searchTerm,
                  mode: "insensitive",
            };
      }

      const properties = await prisma.property.findMany({
            where,
            skip,
            take: limit,
            include: {
                  landlord: true,
                  category: true,
            },
            orderBy: {
                  createdAt: "desc",
            },
      });

      const total = await prisma.property.count({ where });

      return {
            meta: {
                  page,
                  limit,
                  total,
            },
            data: properties,
      };
};

const getAllRentals = async (query: IRentalQuery) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (query.status) {
            where.status = query.status;
      }

      const rentals = await prisma.rentalRequest.findMany({
            where,
            skip,
            take: limit,
            include: {
                  tenant: true,
                  landlord: true,
                  property: true,
            },
            orderBy: {
                  createdAt: "desc",
            },
      });

      const total = await prisma.rentalRequest.count({
            where,
      });

      return {
            meta: {
                  page,
                  limit,
                  total,
            },
            data: rentals,
      };
};

export const AdminService = {
      getAllUsers,
      updateUserStatus,
      getAllProperties,
      getAllRentals,
};