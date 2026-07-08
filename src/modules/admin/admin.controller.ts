import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

// Get all users for admin
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
      const result = await AdminService.getAllUsers(req.query);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Users retrieved successfully",
            data: result.data,
            meta: result.meta,
      });
});



// update user status
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {

      const id = req.params.id as string;
      if (!id) {
            throw new Error("User ID is required");
      }


      const result = await AdminService.updateUserStatus(
            req.params.id,
            req.body
      );

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User status updated successfully",
            data: result,
      });
});

/**
 * GET /api/admin/properties
 */
const getAllProperties = catchAsync(async (req: Request, res: Response) => {
      const result = await AdminService.getAllProperties(req.query);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Properties retrieved successfully",
            data: result.data,
            meta: result.meta,
      });
});

/**
 * GET /api/admin/rentals
 */
const getAllRentals = catchAsync(async (req: Request, res: Response) => {
      const result = await AdminService.getAllRentals(req.query);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Rental requests retrieved successfully",
            data: result.data,
            meta: result.meta,
      });
});

export const AdminController = {
      getAllUsers,
      updateUserStatus,
      getAllProperties,
      getAllRentals,
};