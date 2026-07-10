import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { AdminController } from "./admin.controller";

const router = Router();

router.get(
  "/users",
  auth(UserRole.ADMIN),
  AdminController.getAllUsers
);

router.patch(
  "/users/:id",
  auth(UserRole.ADMIN),
  AdminController.updateUserStatus
);

router.get(
  "/properties",
  auth(UserRole.ADMIN),
  AdminController.getAllProperties
);

router.get(
  "/rentals",
  auth(UserRole.ADMIN),
  AdminController.getAllRentals
);

router.get(
  "/dashboard",
  auth(UserRole.ADMIN),
  AdminController.getDashboardStats
);

export const AdminRoutes = router;