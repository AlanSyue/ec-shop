import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    productId: number;

    @Column()
    amount: number;

    @Column({ nullable: true })
    orderId: number;

    @Column("timestamp", { precision: 3, default: () => "CURRENT_TIMESTAMP(3)" })
    createdAt: Date;

    @Column("timestamp", { precision: 3, default: () => "CURRENT_TIMESTAMP(3)", onUpdate: "CURRENT_TIMESTAMP(3)" })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.carts)
    user: User

    @ManyToOne(() => Product, (product) => product.carts)
    product: Product

    @ManyToOne(() => Order, (order) => order.carts)
    order: Order
}
