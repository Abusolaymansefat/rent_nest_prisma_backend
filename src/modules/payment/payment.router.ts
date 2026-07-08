import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create",
  auth(UserRole.TENANT),
  PaymentController.createPaymentIntent
);

router.post(
  "/confirm",
  auth(UserRole.TENANT),
  PaymentController.confirmPayment
);

router.get(
  "/",
  auth(UserRole.TENANT),
  PaymentController.getMyPayments
);

router.get(
  "/:id",
  auth(UserRole.TENANT),
  PaymentController.getSinglePayment
);

export const PaymentRoutes = router;