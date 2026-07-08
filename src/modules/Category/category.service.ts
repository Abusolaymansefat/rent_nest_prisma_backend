import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "./category.interface";

const createCategory = async (payload: ICreateCategory) => {
  return prisma.category.create({
    data: payload,
  });
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const CategoryService = {
  createCategory,
  getAllCategories,
};