import argon2 from 'argon2';

export class PasswordUtils {
  static async hashPassword(unencryptedPassword: string): Promise<string> {
    return await argon2.hash(unencryptedPassword);
  }

  static async verifyPassword(unencryptedPassword: string, hashedPassword: string): Promise<boolean> {
    return await argon2.verify(hashedPassword, unencryptedPassword);
  }
}
