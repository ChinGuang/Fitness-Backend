import { Router } from "express";

export const Auth = Router();

Auth.post('/login', (req, res) => {
  res.send('Login successful!');
});
