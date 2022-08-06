import { MigrationInterface, QueryRunner } from "typeorm"

export class migrations1659826861827 implements MigrationInterface {
    name = 'migrations1659826861827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT product (name, price, inventory) VALUES
                ('巧克力', 35, 10),
                ('蝦味先', 50, 5),
                ('ps5', 10000, 7),
                ('手錶', 100, 20),
                ('紅茶', 15, 30),
                ('茶葉蛋', 10, 50)
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
