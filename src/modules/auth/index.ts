import { AppDataSource } from "../../db/data-source";
import { User } from "../../entity/User";
import argon2 from 'argon2';

export class PasswordUtils {
  static async hashPassword(unencryptedPassword: string): Promise<string> {
    return await argon2.hash(unencryptedPassword);
  }

  static async verifyPassword(unencryptedPassword: string, hashedPassword: string): Promise<boolean> {
    return await argon2.verify(hashedPassword, unencryptedPassword);
  }
}

export class AuthModule {
  static async authenticate(payload: { name: string, pass: string }): Promise<User | null> {
    const { name, pass } = payload;
    const user = await AppDataSource.manager.findOne(User, { where: { name } });
    if (!user) return null;
    const passwordMatched = await PasswordUtils.verifyPassword(pass, user.password);
    return passwordMatched ? user : null;
  }
}
