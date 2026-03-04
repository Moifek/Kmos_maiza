import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import type { Order } from './order.entity';
import type { MenuItem } from '../../menu/entities/menu-item.entity';

@Entity({ tableName: 'order_items' })
export class OrderItem {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne('Order')
  order!: Order;

  @ManyToOne('MenuItem')
  menuItem!: MenuItem;

  @Property()
  quantity!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;

  @Property({ nullable: true })
  notes?: string;

  @Property()
  createdAt: Date = new Date();
}
