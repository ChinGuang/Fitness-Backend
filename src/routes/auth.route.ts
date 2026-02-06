import { Router } from "express";
import { LoginSchema } from "../models/user.interface";
import { AuthModule } from "../modules/auth";

export const Auth = Router();

Auth.post('/login', async (req, res) => {
  try {
    const { username, password } = LoginSchema.parse(req.body);
    const user = await AuthModule.authenticate({ name: username, pass: password });
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(200).json({ message: 'Login successful!' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid request' });
  }
});
