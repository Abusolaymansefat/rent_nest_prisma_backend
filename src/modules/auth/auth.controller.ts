import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
      const result = await AuthService.register(req.body);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User registered successfully",
            data: result,
      });
});

const login = catchAsync(async (req: Request, res: Response) => {
      const result = await AuthService.login(req.body);

      // HTTP Only Cookie
      res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
      });

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Login successful",
            data: {
                  accessToken: result.accessToken,
            },
      });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;

      if (!user) {
            return sendResponse(res, {
                  success: false,
                  statusCode: httpStatus.UNAUTHORIZED,
                  message: "Unauthorized",
                  data: null,
            });
      }

      const result = await AuthService.getMe(user.id);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Profile retrieved successfully",
            data: result,
      });
});

const logout = catchAsync(async (_req: Request, res: Response) => {
      res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
      });

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Logout successful",
            data: null,
      });
});

export const AuthController = {
      register,
      login,
      getMe,
      logout,
};