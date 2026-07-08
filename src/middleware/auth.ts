import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { verifyToken } from "../utils/jwt";

interface JwtUser {
      id: string;
      email: string;
      name: string;
      role: string;
}

declare global {
      namespace Express {
            interface Request {
                  user?: JwtUser;
            }
      }
}

export const auth = (...allowedRoles: string[]) => {
      return catchAsync(
            async (req: Request, res: Response, next: NextFunction) => {
                  let token: string | undefined;

                  // 1. Authorization Header
                  if (
                        req.headers.authorization &&
                        req.headers.authorization.startsWith("Bearer ")
                  ) {
                        token = req.headers.authorization.split(" ")[1];
                  }

                  // 2. Cookie
                  if (!token && req.cookies?.accessToken) {
                        token = req.cookies.accessToken;
                  }

                  if (!token) {
                        return sendResponse(res, {
                              success: false,
                              statusCode: httpStatus.UNAUTHORIZED,
                              message: "Authorization token is required",
                              data: null,
                        });
                  }

                  try {
                        const decoded = verifyToken(token) as JwtUser;

                        if (
                              allowedRoles.length > 0 &&
                              !allowedRoles.includes(decoded.role)
                        ) {
                              return sendResponse(res, {
                                    success: false,
                                    statusCode: httpStatus.FORBIDDEN,
                                    message: "You are not authorized to access this resource",
                                    data: null,
                              });
                        }

                        req.user = {
                              
                              id: decoded.id,
                              email: decoded.email,
                              name: decoded.name,
                              role: decoded.role,
                        };
                        

                        next();
                  } catch (error) {
                        return sendResponse(res, {
                              success: false,
                              statusCode: httpStatus.UNAUTHORIZED,
                              message:
                                    error instanceof Error ? error.message : "Invalid or expired token",
                              data: null,
                        });
                  }
            }
      );
};