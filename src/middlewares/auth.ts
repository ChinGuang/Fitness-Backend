import { NextFunction, Request, Response } from "express";
import { RequestUtils } from "../utils/request";
import { AuthModule } from "../modules/auth";
import csrf from 'csurf';

export async function verifyJwtToken(req: Request, res: Response, next: NextFunction) {
  const token = RequestUtils.getJwtToken(req);
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

const _csrfProtection = csrf({
  cookie: {
    key: 'XSRF-TOKEN',
    httpOnly: false,
    sameSite: 'lax',
    secure: `${process.env.DEV_MODE}` !== 'true',
  }
})

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  _csrfProtection(req, res, (err) => {
    if (err) {
      if (err.code === 'EBADCSRFTOKEN') {
        console.warn('Invalid CSRF token detected');
        return res.status(403).json({ error: 'Invalid CSRF token' })
      }
      return next(err)
    }
    next()
  })
}
