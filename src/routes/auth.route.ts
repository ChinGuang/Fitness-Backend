import { Router } from "express";
import { LoginSchema } from "../models/user.interface";
import { AuthModule } from "../modules/auth";
import { JwtModule } from "../modules/jwt";

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
  try {
    // header
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    console.log(token);
    const decoded = JwtModule.verify(token);
    if (decoded) {
      const token = JwtModule.sign(decoded);
      res.status(200).json({ message: 'Authentication successful!', token });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
});
