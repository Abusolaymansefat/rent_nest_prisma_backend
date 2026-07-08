import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { RentalController } from "./rental.controller";


const router = Router();

router.post(
  "/",
  auth(UserRole.TENANT, UserRole.ADMIN, UserRole.LANDLORD),
  RentalController.createRentalRequest
);

router.get(
  "/",
  auth(UserRole.TENANT, UserRole.ADMIN, UserRole.LANDLORD),
  RentalController.getMyRentals
);

router.get(
  "/:id",
  auth(UserRole.TENANT, UserRole.ADMIN, UserRole.LANDLORD),
  RentalController.getSingleRental
);

export const RentalRoutes = router; 