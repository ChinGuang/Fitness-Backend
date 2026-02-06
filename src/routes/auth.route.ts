import { Router } from "express";

export const Auth = Router();

Auth.post('/login', (req, res) => {
  // res.status(401).json({ message: 'Unauthorized' });
  res.status(200).json({ message: 'Login successful!' });
});
