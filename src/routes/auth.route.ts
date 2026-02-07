import { Router } from "express";
import { LoginSchema } from "../models/user.interface";
import { AuthModule } from "../modules/auth";
import { RequestUtils } from "../utils/request";

export const Auth = Router();

Auth.post('/login', async (req, res) => {
  try {
    const { username, password } = LoginSchema.parse(req.body);
    const token = await AuthModule.login({ username, password });
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(200).json({ token, message: 'Login successful!' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid request' });
  }
});

Auth.post('/authenticate', async (req, res) => {
  await RequestUtils.withBearerToken(req, res, async (token) => {
    try {
      const newToken = await AuthModule.authenticateByToken(token);
      if (newToken) {
        res.status(200).json({ message: 'Authentication successful!', token: newToken });
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Unauthorized' });
    }
  });

});

Auth.post('/logout', async (req, res) => {
  await RequestUtils.withBearerToken(req, res, async (token) => {
    await AuthModule.logout(token);
    res.status(200).json({ message: 'Logout successful!' });
  });
});
