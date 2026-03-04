import type { OrderSource } from '../../shared/types/order-source.type';

export interface OrderProcessingJobData {
  readonly orderId: string;
  readonly orderNumber: string;
  readonly source: OrderSource;
  readonly locationId: string;
  readonly priority: number;
}

export interface KitchenDispatchJobData {
  readonly orderId: string;
  readonly orderNumber: string;
  readonly stationId: string;
  readonly priority: number;
  readonly items: readonly KitchenDispatchItem[];
}

export interface KitchenDispatchItem {
  readonly orderItemId: string;
  readonly menuItemId: string;
  readonly quantity: number;
  readonly notes?: string;
}

export interface NotificationJobData {
  readonly eventName: string;
  readonly payload: Record<string, unknown>;
}
