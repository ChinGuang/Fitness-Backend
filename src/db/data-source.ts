import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/User"

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST ?? 'localhost',
  port: Number.parseInt(process.env.DB_PORT ?? '3306'),
  username: process.env.DB_USER ?? 'admin',
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
})
