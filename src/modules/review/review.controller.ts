import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ReviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const createReview = catchAsync(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.id;

    const result = await ReviewService.createReview(
      tenantId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review submitted successfully",
      data: result,
    });
  }
);

export const ReviewController = {
  createReview,
};