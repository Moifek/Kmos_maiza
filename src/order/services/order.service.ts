import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto } from '../models/create-order.dto';
import { UpdateOrderStatusDto } from '../models/update-order-status.dto';
import { OrderQueueProducer } from '../producers/order-queue.producer';
import { MenuItem } from '../../menu/entities/menu-item.entity';
import { Location } from '../../location/entities/location.entity';
import { isValidTransition } from '../../shared/utils/validate-transition.util';
import { ORDER_EVENTS } from '../../shared/events/order.events';
import { ORDER_STATUS } from '../../shared/types/order-status.type';
import type { PaginatedResult, PaginationParams } from '../../shared/types';
import { v4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    private readonly em: EntityManager,
    private readonly eventEmitter: EventEmitter2,
    private readonly orderQueueProducer: OrderQueueProducer,
  ) {}

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Order>> {
    const [data, total] = await this.em.findAndCount(
      Order,
      {},
      {
        populate: ['items', 'items.menuItem', 'location'],
        orderBy: { createdAt: 'DESC' },
        limit: pagination.limit,
        offset: pagination.offset,
      },
    );
    return { data, total, limit: pagination.limit, offset: pagination.offset };
  }

  async findById(id: string): Promise<Order> {
    const order = await this.em.findOne(Order, { id }, { populate: ['items', 'items.menuItem', 'location'] });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const location = await this.em.findOneOrFail(Location, { id: dto.locationId });
    const orderNumber = this.generateOrderNumber();
    const order = this.em.create(Order, {
      orderNumber,
      status: ORDER_STATUS.RECEIVED,
      source: dto.source,
      location,
      priority: dto.priority ?? 2,
      totalAmount: 0,
      customerName: dto.customerName,
      notes: dto.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    let totalAmount = 0;
    for (const itemDto of dto.items) {
      const menuItem = await this.em.findOneOrFail(MenuItem, { id: itemDto.menuItemId });
      const orderItem = this.em.create(OrderItem, {
        order,
        menuItem,
        quantity: itemDto.quantity,
        unitPrice: menuItem.price,
        notes: itemDto.notes,
        createdAt: new Date(),
      });
      totalAmount += menuItem.price * itemDto.quantity;
      order.items.add(orderItem);
    }
    order.totalAmount = totalAmount;
    await this.em.persistAndFlush(order);
    await this.orderQueueProducer.enqueueOrderProcessing({
      orderId: order.id,
      orderNumber: order.orderNumber,
      source: order.source,
      locationId: location.id,
      priority: order.priority,
    });
    this.eventEmitter.emit(ORDER_EVENTS.CREATED, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      source: order.source,
      priority: order.priority,
    });
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findById(id);
    if (!isValidTransition(order.status, dto.status)) {
      throw new BadRequestException(`Cannot transition from ${order.status} to ${dto.status}`);
    }
    const previousStatus = order.status;
    order.status = dto.status;
    await this.em.flush();
    this.eventEmitter.emit(ORDER_EVENTS.STATUS_CHANGED, {
      orderId: order.id,
      previousStatus,
      newStatus: dto.status,
      updatedBy: 'system',
    });
    return order;
  }

  private generateOrderNumber(): string {
    const prefix = 'ORD';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = v4().substring(0, 4).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}
