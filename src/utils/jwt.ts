import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const ACCESS_SECRET = config.jwt_access_secret as string;

export const signToken = (
      payload: object,
      expiresIn: string = "7d"
) => {
      return jwt.sign(payload, ACCESS_SECRET, {
            expiresIn,
      });
};

export const verifyToken = (token: string): JwtPayload => {
      return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
};