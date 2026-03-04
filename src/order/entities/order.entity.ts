import { Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ORDER_SOURCE } from '../../shared/types/order-source.type';
import type { OrderSource } from '../../shared/types/order-source.type';
import { ORDER_STATUS } from '../../shared/types/order-status.type';
import type { OrderStatus } from '../../shared/types/order-status.type';
import { Location } from '../../location/entities/location.entity';
import type { OrderItem } from './order-item.entity';

@Entity({ tableName: 'orders' })
export class Order {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ unique: true })
  orderNumber!: string;

  @Enum({ items: () => Object.values(ORDER_STATUS), default: ORDER_STATUS.RECEIVED })
  status: OrderStatus = ORDER_STATUS.RECEIVED;

  @Enum({ items: () => Object.values(ORDER_SOURCE) })
  source!: OrderSource;

  @ManyToOne(() => Location)
  location!: Location;

  @Property({ default: 2 })
  priority: number = 2;

  @Property({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number = 0;

  @Property({ nullable: true })
  customerName?: string;

  @Property({ nullable: true })
  notes?: string;

  @OneToMany('OrderItem', (item) => item.order, { orphanRemoval: true })
  items = new Collection<OrderItem>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
