import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { Cart } from "src/entities/cart.entity";
import { OrderItem } from "src/entities/order-item.entity";
import { Order } from "src/entities/order.entity";
import { Product } from "src/entities/product.entity";
import { User } from "src/entities/user.entity"

require("dotenv").config();
const SnakeNamingStrategy = require("typeorm-naming-strategies").SnakeNamingStrategy

export const config: TypeOrmModuleOptions = {
    type: "mysql",
    host: process.env.APP_MYSQL_HOST,
    username: process.env.APP_MYSQL_USER,
    password: process.env.APP_MYSQL_PASSWORD,
    database: process.env.APP_MYSQL_DATABASE,
    entities: [User, Product,Cart ,Order, OrderItem],
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
}
