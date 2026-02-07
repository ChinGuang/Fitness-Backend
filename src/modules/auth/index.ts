import { AppDataSource } from "../../db/data-source";
import { User } from "../../entity/User";
import argon2 from 'argon2';
import { JwtModule } from "../jwt";
import { RedisModule } from "../redis";

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
    const user = await AuthModule.authenticateByPassword({ name: username, pass: password });
    if (!user) {
      return null;
    } else {
      const token = await this.generateJwtToken({
        id: user.id.toString(),
        username: user.name,
      });
      return token;
    }
  }

  static async authenticateByToken(token: string): Promise<string | null> {
    const decoded = await this.validateJwtToken(token);
    if (!decoded) return null;
    const newToken = await this.generateJwtToken(decoded);
    return newToken;
  }

  private static async authenticateByPassword(payload: { name: string, pass: string }): Promise<User | null> {
    const { name, pass } = payload;
    const user = await AppDataSource.manager.findOne(User, { where: { name } });
    if (!user) return null;
    const passwordMatched = await PasswordUtils.verifyPassword(pass, user.password);
    return passwordMatched ? user : null;
  }

  private static async generateJwtToken(userPayload: {
    id: string,
    username: string
  }): Promise<string> {
    const token = JwtModule.sign(userPayload);
    await RedisModule.hset({
      key: 'user-jwt_token',
      field: userPayload.id,
      value: token,
      expireInSec: 15 * 60
    });
    return token;
  }

  private static async validateJwtToken(token: string): Promise<{
    id: string,
    username: string
  } | null> {
    try {
      const decoded = JwtModule.verify(token);
      if (!decoded) return null;
      const tokenFromRedis = await RedisModule.hget({
        key: 'user-jwt_token',
        field: decoded.id
      });
      return token === tokenFromRedis ? decoded : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
