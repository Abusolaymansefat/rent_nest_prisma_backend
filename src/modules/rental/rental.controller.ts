import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RentalService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const createRentalRequest = catchAsync(
      async (req: Request, res: Response) => {
            const tenantId = req.user!.id;

            const result = await RentalService.createRentalRequest(
                  tenantId,
                  req.body
            );

            sendResponse(res, {
                  success: true,
                  statusCode: httpStatus.CREATED,
                  message: "Rental request submitted successfully",
                  data: result,
            });
      }
);

const getMyRentals = catchAsync(
      async (req: Request, res: Response) => {
            const tenantId = req.user!.id;

            const result = await RentalService.getMyRentals(
                  tenantId,
                  req.query
            );

            sendResponse(res, {
                  success: true,
                  statusCode: httpStatus.OK,
                  message: "Rental requests retrieved successfully",
                  data: result.data,
                  meta: result.meta,
            });
      }
);

const getSingleRental = catchAsync(
      async (req: Request, res: Response) => {
            const tenantId = req.user!.id;
            const rentalId = Array.isArray(req.params.id)
                  ? req.params.id[0]
                  : req.params.id;

            if (!rentalId) {
                  throw new Error("Rental ID is required");
            }

            const result = await RentalService.getSingleRental(
                  rentalId,
                  tenantId
            );

            sendResponse(res, {
                  success: true,
                  statusCode: httpStatus.OK,
                  message: "Rental request retrieved successfully",
                  data: result,
            });
      }
);

export const RentalController = {
      createRentalRequest,
      getMyRentals,
      getSingleRental,
};