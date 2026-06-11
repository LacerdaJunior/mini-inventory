import { Request, Response, NextFunction } from "express";
import { JwtProvider } from "../../providers/JwtProvider.js";
import { AppError } from "../../errors/AppError.js";
import { Role } from "../../../../generated/prisma/enums.js";

export function ensureAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token is missing.", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const jwtProvider = new JwtProvider();
    

    const { sub: userId, role } = jwtProvider.verify(token);

    req.user = {
      id: userId,
      role: role, 
    };

    return next();
  } catch {
    throw new AppError("Invalid token.", 401);
  }
}