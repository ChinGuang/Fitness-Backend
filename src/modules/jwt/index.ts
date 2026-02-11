import jwt from 'jsonwebtoken';
import { JwtPayload, JwtSchema } from 'fitness-model-package';

export class JwtModule {
  static sign(payload: JwtPayload): string {
    const privateKey = Buffer.from(
      process.env.JWT_PRIVATE_KEY!,
      'base64'
    ).toString('utf-8');
    const token = jwt.sign(JwtSchema.parse(payload), privateKey, { algorithm: 'RS256', expiresIn: '15m' });
    return token;
  }

  static verify(token: string): JwtPayload | null {
    const publicKey = Buffer.from(
      process.env.JWT_PUBLIC_KEY!,
      'base64'
    ).toString('utf-8');
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    const parsed = JwtSchema.safeParse(decoded);
    if (!parsed.success) {
      return null;
    }
    return parsed.data;
  }
}
