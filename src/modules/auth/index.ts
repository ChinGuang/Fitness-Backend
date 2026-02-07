import { AppDataSource } from "../../db/data-source";
import { User } from "../../entity/User";
import argon2 from 'argon2';
import { JwtModule } from "../jwt";

export class PasswordUtils {
  static async hashPassword(unencryptedPassword: string): Promise<string> {
    return await argon2.hash(unencryptedPassword);
  }

  static async verifyPassword(unencryptedPassword: string, hashedPassword: string): Promise<boolean> {
    return await argon2.verify(hashedPassword, unencryptedPassword);
  }
}

export class AuthModule {
  static async login(payload: {
    username: string,
    password: string
  }): Promise<string | null> {
    const { username, password } = payload;
    const user = await AuthModule.authenticate({ name: username, pass: password });
    if (!user) {
      return null;
    } else {
      const token = JwtModule.sign({
        id: user.id.toString(),
        username: user.name,
      });
      return token;
    }
  }


  static async authenticate(payload: { name: string, pass: string }): Promise<User | null> {
    const { name, pass } = payload;
    const user = await AppDataSource.manager.findOne(User, { where: { name } });
    if (!user) return null;
    const passwordMatched = await PasswordUtils.verifyPassword(pass, user.password);
    return passwordMatched ? user : null;
  }
}
