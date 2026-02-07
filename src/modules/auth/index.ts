import { AppDataSource } from "../../db/data-source";
import { User } from "../../entity/User";
import { PasswordUtils } from "../../utils/password";
import { JwtModule } from "../jwt";
import { RedisModule } from "../redis";

export class AuthModule {
  private static readonly redisUserJwtKey: string = 'user-jwt_token';
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

  static async logout(token: string): Promise<void> {
    const decoded = await this.validateJwtToken(token);
    if (!decoded) return Promise.resolve();
    await RedisModule.hdel({
      key: this.redisUserJwtKey,
      field: decoded.id,
    });
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
      key: this.redisUserJwtKey,
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
        key: this.redisUserJwtKey,
        field: decoded.id
      });
      return token === tokenFromRedis ? decoded : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
