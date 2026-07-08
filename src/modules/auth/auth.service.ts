import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import { prisma } from "../../lib/prisma";
import { signToken } from "../../utils/jwt";
// import { ILoginUser, IRegisterUser } from "./auth.interface";
// import { prisma } from "../../lib/prisma";
// import { signToken } from "../../utils/jwt";


const register = async (payload: IRegisterUser) => {
      const isExist = await prisma.user.findUnique({
            where: {
                  email: payload.email,
            },
      });

      if (isExist) {
            throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(payload.password, 10);

      const result = await prisma.user.create({
            data: {
                  ...payload,
                  password: hashedPassword,
            },
            select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  avatar: true,
                  role: true,
                  createdAt: true,
            },
      });

      return result;
};

const login = async (payload: ILoginUser) => {
      if (!payload?.email || !payload?.password) {
            throw new Error("Email and password are required");
      }

      const user = await prisma.user.findUnique({
            where: {
                  email: payload.email,
            },
      });

      if (!user) {
            throw new Error("User not found");
      }

      const isMatched = await bcrypt.compare(
            payload.password,
            user.password
      );

      if (!isMatched) {
            throw new Error("Invalid credentials");
      }

      const accessToken = signToken(
            {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  role: user.role,
            },
            "7d"
      );

      return {
            accessToken,
      };
};

const getMe = async (id: string) => {
      const result = await prisma.user.findUnique({
            where: {
                  id,
            },
            select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  avatar: true,
                  role: true,
                  activeStatus: true,
                  createdAt: true,
            },
      });

      return result;
};

export const AuthService = {
      register,
      login,
      getMe,
};