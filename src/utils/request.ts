import { Request, Response } from 'express';

export class RequestUtils {
  static async withBearerToken(req: Request, res: Response, handleToken: (token: string) => Promise<void>): Promise<void> {
    const token = this.getBearerToken(req);
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return Promise.resolve();
    }
    await handleToken(token);
  }
  static getBearerToken(req: Request): string | null {
    const token = req.headers['authorization']?.replace('Bearer ', '');;
    if (!token) return null;
    return token;
  }
}
