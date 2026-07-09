import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { LandlordService } from "./landlord.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

interface AuthenticatedRequest extends Request {
      user?: {
            id: string;
            email: string;
            name: string;
            role: string;
      };
}

// create property
const createProperty = catchAsync(async (req: Request, res: Response) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;

      if (!userId) {
            return sendResponse(res, {
                  success: false,
                  statusCode: httpStatus.UNAUTHORIZED,
                  message: "Unauthorized",
            });
      }

      if (!req.body) {
            return sendResponse(res, {
                  success: false,
                  statusCode: httpStatus.BAD_REQUEST,
                  message: "Request body is required",
            });
      }

      const payload = {
            ...req.body,
            categoryId: req.body.categoryId || req.body.category || undefined,
      };

      const result = await LandlordService.createProperty(userId, payload);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Property created successfully",
            data: result,
      });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      const propertyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!userId) {
            return sendResponse(res, {
                  success: false,
                  statusCode: httpStatus.UNAUTHORIZED,
                  message: "Unauthorized",
            });
      }

      if (!propertyId) {
            return sendResponse(res, {
                  success: false,
                  statusCode: httpStatus.BAD_REQUEST,
                  message: "Property id is required",
            });
      }

      const result = await LandlordService.updateProperty(propertyId, userId, req.body);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Property updated successfully",
            data: result,
      });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      const propertyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!userId) {
            return sendResponse(res, {
                  success: false,
                  statusCode: httpStatus.UNAUTHORIZED,
                  message: "Unauthorized",
            });
      }

      if (!propertyId) {
            return sendResponse(res, {
                  success: false,
                  statusCode: httpStatus.BAD_REQUEST,
                  message: "Property id is required",
            });
      }

      const result = await LandlordService.deleteProperty(propertyId, userId);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Property deleted successfully",
            data: result,
      });
});

const getRentalRequests = catchAsync(async (req: Request, res: Response) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;

      if (!userId) {
            return sendResponse(res, {
                  success: false,
                  statusCode: httpStatus.UNAUTHORIZED,
                  message: "Unauthorized",
            });
      }

      const result = await LandlordService.getRentalRequests(userId);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Rental requests retrieved successfully",
            data: result,
      });
});

const updateRentalRequestStatus = catchAsync(
      async (req: Request, res: Response) => {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?.id;
            const rentalRequestId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

            if (!userId) {
                  return sendResponse(res, {
                        success: false,
                        statusCode: httpStatus.UNAUTHORIZED,
                        message: "Unauthorized",
                  });
            }

            if (!rentalRequestId) {
                  return sendResponse(res, {
                        success: false,
                        statusCode: httpStatus.BAD_REQUEST,
                        message: "Rental request id is required",
                  });
            }

            const result = await LandlordService.updateRentalRequestStatus(rentalRequestId, req.body);

            sendResponse(res, {
                  success: true,
                  statusCode: httpStatus.OK,
                  message: "Rental request updated successfully",
                  data: result,
            });
      }
);

export const LandlordController = {
      createProperty,
      updateProperty,
      deleteProperty,
      getRentalRequests,
      updateRentalRequestStatus,
};