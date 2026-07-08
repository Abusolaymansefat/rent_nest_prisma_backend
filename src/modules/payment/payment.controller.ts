import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const createPaymentIntent = catchAsync(async (req: any, res: Response) => {
  const result = await PaymentService.createPaymentIntent(
    req.user.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment intent created successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: any, res: Response) => {
  const result = await PaymentService.confirmPayment(
    req.user.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment confirmed successfully",
    data: result,
  });
});

const getMyPayments = catchAsync(async (req: any, res: Response) => {
  const result = await PaymentService.getMyPayments(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment history retrieved successfully",
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req: any, res: Response) => {
  const result = await PaymentService.getSinglePayment(
    req.params.id,
    req.user.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment retrieved successfully",
    data: result,
  });
});

export const PaymentController = {
  createPaymentIntent,
  confirmPayment,
  getMyPayments,
  getSinglePayment,
};