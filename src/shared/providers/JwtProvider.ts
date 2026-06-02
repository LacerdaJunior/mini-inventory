import jwt, { JwtPayload } from "jsonwebtoken";
import { ITokenProvider } from "./ITokenProvider.js";

export class JwtProvider implements ITokenProvider {
  generateToken(payload: { sub: string }): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
  }

  verify(token: string): { sub: string } {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    return {
      sub: decoded.sub!,
    };
  }
}
