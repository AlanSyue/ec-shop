import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;

    @Column()
    inventory: number;

    @Column("timestamp", { precision: 3, default: () => "CURRENT_TIMESTAMP(3)" })
    createdAt: Date;

    @Column("timestamp", { precision: 3, default: () => "CURRENT_TIMESTAMP(3)", onUpdate: "CURRENT_TIMESTAMP(3)" })
    updatedAt: Date;

    @OneToMany(() => Cart, (cart) => cart.product)
    carts: Cart[]

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[]

    public toObject() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            inventory: this.inventory,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        }
    }
}
