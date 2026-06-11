import { Role } from "../../../generated/prisma/enums.js";

export type TokenPayload = {
  sub: string;
  role: Role;
};

export interface ITokenProvider {
  generateToken(payload: TokenPayload): string;

  verify(token: string): TokenPayload;
}
