import { Router } from "express";
import { auth } from "../../middleware/auth";
import { LandlordController } from "./landlord.controller";
import { UserRole } from "../../../generated/prisma/enums";


const router = Router();

router.post(
  "/properties",
  auth(UserRole.LANDLORD, UserRole.ADMIN, UserRole.TENANT),
  LandlordController.createProperty
);


router.put(
  "/properties/:id",
  auth(UserRole.LANDLORD, UserRole.ADMIN, UserRole.TENANT),
  LandlordController.updateProperty
);

router.delete(
  "/properties/:id",
  auth(UserRole.LANDLORD, UserRole.ADMIN, UserRole.TENANT),
  LandlordController.deleteProperty
);

router.get(
  "/requests",
  auth(UserRole.LANDLORD, UserRole.ADMIN, UserRole.TENANT),
  LandlordController.getRentalRequests
);

router.patch(
  "/requests/:id",
  auth(UserRole.LANDLORD, UserRole.ADMIN, UserRole.TENANT),
  LandlordController.updateRentalRequestStatus
);

export const LandlordRoutes = router;