import { prisma } from "../../lib/prisma";

const getAllProperties = async (query: any) => {
  const { location, type, minPrice, maxPrice } = query;

  return prisma.property.findMany({
    where: {
      location: location || undefined,
      propertyType: type || undefined,

      price: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      },

      availability: "AVAILABLE",
    },

    include: {
      landlord: true,
      category: true,
      reviews: true,
    },
  });
};

const getSingleProperty = async (id: string) => {
  return prisma.property.findUnique({
    where: {
      id,
    },

    include: {
      landlord: true,
      category: true,
      reviews: true,
    },
  });
};


export const PropertyService = {
  getAllProperties,
  getSingleProperty,
  
};