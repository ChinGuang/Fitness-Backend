import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/User"
import { Member } from "../entity/Member"

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST ?? 'localhost',
  port: Number.parseInt(process.env.MYSQL_PORT ?? '3306'),
  username: process.env.MYSQL_USER ?? 'admin',
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
  synchronize: true,
  logging: false,
  entities: [User, Member],
  migrations: [],
  subscribers: [],
})
