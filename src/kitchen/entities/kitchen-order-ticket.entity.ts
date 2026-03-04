import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { KitchenStation } from './kitchen-station.entity';
import { Order } from '../../order/entities/order.entity';

export const TICKET_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  VOIDED: 'voided',
} as const;

export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];

@Entity({ tableName: 'kitchen_order_tickets' })
export class KitchenOrderTicket {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => Order)
  order!: Order;

  @ManyToOne(() => KitchenStation)
  station!: KitchenStation;

  @Enum({ items: () => Object.values(TICKET_STATUS), default: TICKET_STATUS.PENDING })
  status: TicketStatus = TICKET_STATUS.PENDING;

  @Property({ default: 2 })
  priority: number = 2;

  @Property({ nullable: true })
  startedAt?: Date;

  @Property({ nullable: true })
  completedAt?: Date;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
