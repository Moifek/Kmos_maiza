import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { KitchenStation } from '../entities/kitchen-station.entity';
import { KitchenOrderTicket, TICKET_STATUS } from '../entities/kitchen-order-ticket.entity';
import type { TicketStatus } from '../entities/kitchen-order-ticket.entity';
import { CreateKitchenStationDto } from '../models/create-kitchen-station.dto';
import { UpdateKitchenStationDto } from '../models/update-kitchen-station.dto';
import type { PaginatedResult, PaginationParams } from '../../shared/types';
import { Order } from '../../order/entities/order.entity';

@Injectable()
export class KitchenService {
  constructor(private readonly em: EntityManager) {}

  async findAllStations(pagination: PaginationParams): Promise<PaginatedResult<KitchenStation>> {
    const [data, total] = await this.em.findAndCount(
      KitchenStation,
      {},
      { orderBy: { sortOrder: 'ASC', name: 'ASC' }, limit: pagination.limit, offset: pagination.offset },
    );
    return { data, total, limit: pagination.limit, offset: pagination.offset };
  }

  async createStation(dto: CreateKitchenStationDto): Promise<KitchenStation> {
    const station = this.em.create(KitchenStation, {
      name: dto.name,
      description: dto.description,
      locationId: dto.locationId,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.em.persistAndFlush(station);
    return station;
  }

  async updateStation(id: string, dto: UpdateKitchenStationDto): Promise<KitchenStation> {
    const station = await this.findStationById(id);
    this.em.assign(station, dto);
    await this.em.flush();
    return station;
  }

  async removeStation(id: string): Promise<void> {
    const station = await this.findStationById(id);
    await this.em.removeAndFlush(station);
  }

  async findStationById(id: string): Promise<KitchenStation> {
    const station = await this.em.findOne(KitchenStation, { id });
    if (!station) {
      throw new NotFoundException(`Station ${id} not found`);
    }
    return station;
  }

  async findTicketsByStation(stationId: string): Promise<KitchenOrderTicket[]> {
    return this.em.find(
      KitchenOrderTicket,
      { station: { id: stationId } },
      { populate: ['order', 'station'], orderBy: { priority: 'ASC', createdAt: 'ASC' } },
    );
  }

  async findActiveTickets(): Promise<KitchenOrderTicket[]> {
    return this.em.find(
      KitchenOrderTicket,
      { status: { $in: [TICKET_STATUS.PENDING, TICKET_STATUS.IN_PROGRESS] } },
      { populate: ['order', 'station'], orderBy: { priority: 'ASC', createdAt: 'ASC' } },
    );
  }

  async updateTicketStatus(ticketId: string, status: TicketStatus): Promise<KitchenOrderTicket> {
    const ticket = await this.em.findOne(KitchenOrderTicket, { id: ticketId }, { populate: ['order', 'station'] });
    if (!ticket) {
      throw new NotFoundException(`Ticket ${ticketId} not found`);
    }
    ticket.status = status;
    if (status === TICKET_STATUS.IN_PROGRESS && !ticket.startedAt) {
      ticket.startedAt = new Date();
    }
    if (status === TICKET_STATUS.COMPLETED) {
      ticket.completedAt = new Date();
    }
    await this.em.flush();
    return ticket;
  }

  async createTicketForDispatch(params: { orderId: string; stationId: string; priority: number }): Promise<KitchenOrderTicket> {
    const order = await this.em.findOne(Order, { id: params.orderId });
    if (!order) {
      throw new NotFoundException(`Order ${params.orderId} not found`);
    }
    const station = await this.em.findOne(KitchenStation, { id: params.stationId });
    if (!station) {
      throw new NotFoundException(`Station ${params.stationId} not found`);
    }
    const existingTicket = await this.em.findOne(
      KitchenOrderTicket,
      {
        order: { id: params.orderId },
        station: { id: params.stationId },
        status: { $in: [TICKET_STATUS.PENDING, TICKET_STATUS.IN_PROGRESS] },
      },
    );
    if (existingTicket) {
      return existingTicket;
    }
    const ticket = this.em.create(KitchenOrderTicket, {
      order,
      station,
      status: TICKET_STATUS.PENDING,
      priority: params.priority,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.em.persistAndFlush(ticket);
    return ticket;
  }
}
