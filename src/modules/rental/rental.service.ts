import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateRentalRequest, IRentalQuery } from "./rental.interface";


const createRentalRequest = async (
      tenantId: string,
      payload: ICreateRentalRequest
) => {
      const property = await prisma.property.findUnique({
            where: {
                  id: payload.propertyId,
            },
            include: {
                  landlord: true,
            },
      });

      if (!property) {
            throw new Error("Property not found");
      }

      if (property.availability !== "AVAILABLE") {
            throw new Error("Property is not available for rent");
      }

      const alreadyRequested = await prisma.rentalRequest.findFirst({
            where: {
                  propertyId: payload.propertyId,
                  tenantId,
                  status: {
                        in: ["PENDING", "APPROVED", "ACTIVE"],
                  },
            },
      });

      if (alreadyRequested) {
            throw new Error("You have already requested this property");
      }

      const rental = await prisma.rentalRequest.create({
            data: {
                  propertyId: payload.propertyId,
                  tenantId,
                  landlordId: property.landlordId,
                  moveInDate: new Date(payload.moveInDate),
                  duration: payload.duration ?? 30,
                  message: payload.message,
                  status: RentalStatus.PENDING,
            },
            include: {
                  property: true,
                  tenant: true,
                  landlord: true,
            },
      });

      return rental;
};

const getMyRentals = async (
      tenantId: string,
      query: IRentalQuery
) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;

      const where: any = {
            tenantId,
      };

      if (query.status) {
            where.status = query.status;
      }

      const data = await prisma.rentalRequest.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                  createdAt: "desc",
            },
            include: {
                  property: true,
                  landlord: {
                        select: {
                              id: true,
                              name: true,
                              email: true,
                              phone: true,
                        },
                  },
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
            data,
      };
};

const getSingleRental = async (
      rentalId: string,
      tenantId: string
) => {
      const rental = await prisma.rentalRequest.findFirst({
            where: {
                  id: rentalId,
                  tenantId,
            },
            include: {
                  property: true,
                  tenant: true,
                  landlord: true,
                  payment: true,
                  review: true,
            },
      });

      if (!rental) {
            throw new Error("Rental request not found");
      }

      return rental;
};

export const RentalService = {
      createRentalRequest,
      getMyRentals,
      getSingleRental,
};