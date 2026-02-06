import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const JwtSchema = z.object({
  id: z.string(),
  username: z.string(),
});

export type JwtPayload = z.infer<typeof JwtSchema>;

export type LoginDto = z.infer<typeof LoginSchema>;
