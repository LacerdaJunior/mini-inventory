import { Request, Response, NextFunction } from "express";
import { AppError } from "../../errors/AppError.js";

export function ensureAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const { role } = req.user;

  if (role !== "ADMIN") {
    throw new AppError(
      "Acesso negado. Requer privilégios de administrador.",
      403,
    );
  }

  return next();
}
