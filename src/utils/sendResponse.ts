import { Response } from "express";

interface IResponseData<T> {
      success: boolean;
      statusCode: number;
      message: string;
      data?: T;
      meta?: unknown;
}

export const sendResponse = <T>(res: Response, data: IResponseData<T>) => {
      res.status(data.statusCode).json({
            success: data.success,
            statusCode: data.statusCode,
            message: data.message,
            data: data.data,
            meta: data.meta,
      });
};
