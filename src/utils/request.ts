import { Request, Response } from 'express';

export class RequestUtils {
  static async withJwtToken(req: Request, res: Response, handleToken: (token: string) => Promise<void>): Promise<void> {
    const token = this.getJwtToken(req);
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return Promise.resolve();
    }
    await handleToken(token);
  }
  static getJwtToken(req: Request): string | null {
    const token = req.cookies?.token;
    if (!token) return null;
    return token;
  }
}
