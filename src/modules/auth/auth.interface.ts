export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
}