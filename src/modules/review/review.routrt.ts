import { Router } from "express";

import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { ReviewController } from "./review.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.TENANT),
  ReviewController.createReview
);

export const ReviewRoutes = router;