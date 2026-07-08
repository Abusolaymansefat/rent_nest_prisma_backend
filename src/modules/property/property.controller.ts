import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PropertyService } from "./property.service";

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
      const result = await PropertyService.getAllProperties(req.query);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Properties retrieved successfully",
            data: result,
      });
});

const getSingleProperty = catchAsync(async (req: Request, res: Response) => {

      const data = req.params.id as string;

      const result = await PropertyService.getSingleProperty(data);
     

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Property retrieved successfully",
            data: result,
      });
});



export const PropertyController = {
      getAllProperties,
      getSingleProperty,
};