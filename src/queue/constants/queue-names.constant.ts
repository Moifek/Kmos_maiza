export const QUEUE_NAMES = {
  ORDER_PROCESSING: 'order-processing',
  KITCHEN_DISPATCH: 'kitchen-dispatch',
  NOTIFICATIONS: 'notifications',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
