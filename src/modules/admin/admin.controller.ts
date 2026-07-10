import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

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

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!id) {
            return sendResponse(res, {
                  success: false,
                  statusCode: httpStatus.BAD_REQUEST,
                  message: "User ID is required",
            });
      }

      const result = await AdminService.updateUserStatus(id, req.body);

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

/**
 * GET /api/admin/dashboard
 */
const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
      const result = await AdminService.getDashboardStats();

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Dashboard stats retrieved successfully",
            data: result,
      });
});

export const AdminController = {
      getAllUsers,
      updateUserStatus,
      getAllProperties,
      getAllRentals,
      getDashboardStats,
};