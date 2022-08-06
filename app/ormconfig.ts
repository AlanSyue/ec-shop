import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

config()

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.APP_MYSQL_HOST,
    port: 3306,
    username: process.env.APP_MYSQL_USER,
    password: process.env.APP_MYSQL_PASSWORD,
    database: process.env.APP_MYSQL_DATABASE,
    entities: ['dist/**/*.entity.js'],
    logging: true,
    synchronize: false,
    migrationsRun: false,
    migrations: ['dist/**/migrations/*.js'],
    migrationsTableName: 'history',
    namingStrategy: new SnakeNamingStrategy(),
})
