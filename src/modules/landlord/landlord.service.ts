import { prisma } from "../../lib/prisma";
import { ICreateProperty, IUpdateRentalRequest } from "./landlord.interface";

const createProperty = async (
      userId: string,
      payload: ICreateProperty
) => {
      if (!payload.categoryId) {
            throw new Error("Category id is required");
      }

      const { category, ...propertyData } = payload;
      return prisma.property.create({
            data: {
                  ...propertyData,
                  landlordId: userId,
                  categoryId: payload.categoryId,
            },
      });
};

const updateProperty = async (
      id: string,
      userId: string,
      payload: Partial<ICreateProperty>
) => {
      const { category, ...propertyData } = payload;
      return prisma.property.update({
            where: {
                  id,
                  landlordId: userId,
            },
            data: propertyData,
      });
};

const deleteProperty = async (
      id: string,
      userId: string
) => {
      return prisma.property.delete({
            where: {
                  id,
                  landlordId: userId,
            },
      });
};

const getRentalRequests = async (userId: string) => {
      return prisma.rentalRequest.findMany({
            where: {
                  landlordId: userId,
            },
            include: {
                  tenant: true,
                  property: true,
            },
      });
};

const updateRentalRequestStatus = async (
      id: string,
      payload: IUpdateRentalRequest
) => {
      return prisma.rentalRequest.update({
            where: {
                  id,
            },
            data: {
                  status: payload.status,
            },
      });
};

export const LandlordService = {
      createProperty,
      updateProperty,
      deleteProperty,
      getRentalRequests,
      updateRentalRequestStatus,
};