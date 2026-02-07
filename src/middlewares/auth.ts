import { NextFunction, Request, Response } from "express";
import { RequestUtils } from "../utils/request";
import { AuthModule } from "../modules/auth";

export async function verifyJwtToken(req: Request, res: Response, next: NextFunction) {
  const token = RequestUtils.getBearerToken(req);
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return Promise.resolve();
  }
  const isValid = await AuthModule.validateToken(token);
  if (!isValid) {
    res.status(401).json({ message: 'Unauthorized' });
    return Promise.resolve();
  }
  next();
}
