import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create",
  auth(UserRole.TENANT, UserRole.ADMIN, UserRole.LANDLORD),
  PaymentController.createPaymentIntent
);

router.post(
  "/confirm",
  auth(UserRole.TENANT, UserRole.ADMIN, UserRole.LANDLORD),
  PaymentController.confirmPayment
);

// Stripe webhook - auth middleware নেই, কারণ Stripe সরাসরি কল করে
router.post("/webhook", PaymentController.handleWebhook);

router.get(
  "/",
  auth(UserRole.TENANT, UserRole.ADMIN, UserRole.LANDLORD),
  PaymentController.getMyPayments
);

router.get(
  "/:id",
  auth(UserRole.TENANT, UserRole.ADMIN, UserRole.LANDLORD),
  PaymentController.getSinglePayment
);

export const PaymentRoutes = router;