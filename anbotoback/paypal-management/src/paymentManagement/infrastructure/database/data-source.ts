import { DataSource } from "typeorm";
import { Order } from "./models/Order";
import { PremiumSubscription } from "./models/PremiumSuscription";

process.loadEnvFile();
export const AppDataSource = new DataSource({
  type:  process.env.DB_DIALECT as "mysql" || "sqlite" || "mariadb" || "mongodb" || "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Order, PremiumSubscription],
  migrations: [__dirname + "/migrations/**/*.ts"],
  synchronize: false,
  logging: true,
});