import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { AuthController } from "./auth.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.get(
      "/me",
      auth(UserRole.TENANT, UserRole.LANDLORD, UserRole.ADMIN),
      AuthController.getMe
);

export const AuthRoutes = router;