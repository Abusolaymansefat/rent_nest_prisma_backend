declare module "jsonwebtoken" {
      export interface JwtPayload {
            [key: string]: any;
            iat?: number;
            exp?: number;
      }

      export function sign(payload: object | string, secretOrPrivateKey: string, options?: object): string;
      export function verify(token: string, secretOrPrivateKey: string): JwtPayload | string;

      const jwt: {
            sign: typeof sign;
            verify: typeof verify;
      };

      export default jwt;
}
