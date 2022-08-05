import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { Users } from "./src/entities/users.entity"

require("dotenv").config();
const SnakeNamingStrategy = require("typeorm-naming-strategies").SnakeNamingStrategy

export const config: TypeOrmModuleOptions = {
    type: "mysql",
    host: process.env.APP_MYSQL_HOST,
    username: process.env.APP_MYSQL_USER,
    password: process.env.APP_MYSQL_PASSWORD,
    database: process.env.APP_MYSQL_DATABASE,
    entities: [Users],
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
}
