import { ORDER_TRANSITIONS } from '../types/order-status.type';
import type { OrderStatus } from '../types/order-status.type';

/**
 * Validates whether an order status transition is allowed.
 * @returns true if the transition from `current` to `next` is valid.
 */
export function isValidTransition(current: OrderStatus, next: OrderStatus): boolean {
  const allowed = ORDER_TRANSITIONS[current];
  return allowed.includes(next);
}
