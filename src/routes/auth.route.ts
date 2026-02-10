import { Router, Response } from "express";
import { LoginSchema } from "../models/user.interface";
import { AuthModule } from "../modules/auth";
import { RequestUtils } from "../utils/request";
import { TimeConverter } from "../utils/time";

export const AuthRouter = Router();
export const jwtTokenExpireInMilliSec = TimeConverter.convertToMilliseconds(process.env.JWT_TOKEN_EXPIRE!);

function setTokenCookie(res: Response, token: string) {
  res.cookie('token', token, { httpOnly: true, secure: `${process.env.DEV_MODE}` !== 'true', maxAge: jwtTokenExpireInMilliSec });
}

AuthRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = LoginSchema.parse(req.body);
    const token = await AuthModule.login({ username, password });
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      setTokenCookie(res, token);
      res.status(200).json({ message: 'Login successful!' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid request' });
  }
});

AuthRouter.post('/authenticate', async (req, res) => {
  await RequestUtils.withJwtToken(req, res, async (token) => {
    try {
      const newToken = await AuthModule.authenticateByToken(token);
      if (newToken) {
        setTokenCookie(res, token);
        res.status(200).json({ message: 'Authentication successful!' });
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Unauthorized' });
    }
  });

});

AuthRouter.post('/logout', async (req, res) => {
  await RequestUtils.withJwtToken(req, res, async (token) => {
    await AuthModule.logout(token);
    res.cookie('token', '', { httpOnly: true, secure: `${process.env.DEV_MODE}` !== 'true', maxAge: 0 });
    res.status(200).json({ message: 'Logout successful!' });
  });
});
