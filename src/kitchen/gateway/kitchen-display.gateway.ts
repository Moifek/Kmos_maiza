import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export const KDS_EVENTS = {
  ORDER_NEW: 'order:new',
  ORDER_UPDATED: 'order:updated',
  TICKET_UPDATED: 'ticket:updated',
  JOIN_STATION: 'join-station',
} as const;

@WebSocketGateway({ namespace: '/kitchen-display', cors: { origin: '*' } })
export class KitchenDisplayGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(KitchenDisplayGateway.name);

  afterInit(): void {
    this.logger.log('Kitchen Display WebSocket gateway initialized');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(KDS_EVENTS.JOIN_STATION)
  handleJoinStation(client: Socket, stationId: string): void {
    client.join(`station:${stationId}`);
    this.logger.log(`Client ${client.id} joined station ${stationId}`);
  }

  emitNewOrder(stationId: string, payload: unknown): void {
    this.server.to(`station:${stationId}`).emit(KDS_EVENTS.ORDER_NEW, payload);
  }

  emitTicketUpdate(stationId: string, payload: unknown): void {
    this.server.to(`station:${stationId}`).emit(KDS_EVENTS.TICKET_UPDATED, payload);
  }
}
