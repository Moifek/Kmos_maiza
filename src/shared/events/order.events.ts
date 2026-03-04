export const ORDER_EVENTS = {
  CREATED: 'order-created',
  STATUS_CHANGED: 'order-status-changed',
  CANCELLED: 'order-cancelled',
  DISPATCHED_TO_KITCHEN: 'order-dispatched-to-kitchen',
} as const;

export interface OrderCreatedEvent {
  readonly orderId: string;
  readonly orderNumber: string;
  readonly source: string;
  readonly priority: number;
}

export interface OrderStatusChangedEvent {
  readonly orderId: string;
  readonly previousStatus: string;
  readonly newStatus: string;
  readonly updatedBy: string;
}

export interface OrderCancelledEvent {
  readonly orderId: string;
  readonly reason?: string;
}

export interface OrderDispatchedToKitchenEvent {
  readonly orderId: string;
  readonly stationId: string;
}
