import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";
import jwt from "jsonwebtoken";

export const globalErrorHandler = (
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
) => {
      console.error("🔥 Global Error:", err);

      let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
      let message = "Something went wrong";
      let errorCode: string | null = null;
      let name = "Internal Server Error";

      // Custom Error
      if (err?.statusCode) {
            statusCode = err.statusCode;
            message = err.message;
            name = err.name || "Error";
      }

      // Prisma Validation Error
      else if (err instanceof Prisma.PrismaClientValidationError) {
            statusCode = httpStatus.BAD_REQUEST;
            name = "Prisma Validation Error";
            message = "Invalid request data.";
      }

      // Prisma Known Error
      else if (err instanceof Prisma.PrismaClientKnownRequestError) {
            errorCode = err.code;
            name = "Prisma Client Error";

            switch (err.code) {
                  case "P2002":
                        statusCode = httpStatus.CONFLICT;
                        message = "Duplicate value already exists.";
                        break;

                  case "P2003":
                        statusCode = httpStatus.BAD_REQUEST;
                        message = "Foreign key constraint failed.";
                        break;

                  case "P2025":
                        statusCode = httpStatus.NOT_FOUND;
                        message = "Record not found.";
                        break;

                  default:
                        statusCode = httpStatus.BAD_REQUEST;
                        message = err.message;
            }
      }

      // JWT Expired
      else if (err.name === "TokenExpiredError") {
            statusCode = httpStatus.UNAUTHORIZED;
            name = "TokenExpiredError";
            message = "Access token has expired.";
      }

      // Invalid JWT
      else if (err.name === "JsonWebTokenError") {
            statusCode = httpStatus.UNAUTHORIZED;
            name = "JsonWebTokenError";
            message = "Invalid access token.";
      }

      // Normal Error
      else if (err instanceof Error) {
            statusCode = httpStatus.BAD_REQUEST;
            name = err.name;
            message = err.message;
      }

      return res.status(statusCode).json({
            success: false,
            statusCode,
            errorCode,
            name,
            message,
            stack:
                  process.env.NODE_ENV === "development"
                        ? err?.stack
                        : undefined,
      });
};

