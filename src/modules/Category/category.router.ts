import { Router } from "express";
import { CategoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT),
  CategoryController.createCategory
);

router.get(
  "/",
  CategoryController.getAllCategories
);

export const CategoryRoutes = router;