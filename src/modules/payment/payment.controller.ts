import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import { stripe } from "../../lib/stripe";
import config from "../../config";

const createPaymentIntent = catchAsync(async (req: any, res: Response) => {
  if (!req.body) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Request body is required",
    });
  }

  const result = await PaymentService.createPaymentIntent(req.user.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment session created successfully",
    data: result, 
  });
});

const confirmPayment = catchAsync(async (req: any, res: Response) => {
  if (!req.body) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Request body is required",
    });
  }

  const result = await PaymentService.confirmPayment(req.user.id, req.body);

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
  const result = await PaymentService.getSinglePayment(req.params.id, req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe_webhook_secret as string
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    await PaymentService.markPaymentCompleted(session.id);
  }

  res.json({ received: true });
});

export const PaymentController = {
  createPaymentIntent,
  confirmPayment,
  getMyPayments,
  getSinglePayment,
  handleWebhook,
};