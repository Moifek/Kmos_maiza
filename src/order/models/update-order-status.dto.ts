import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ORDER_STATUS } from '../../shared/types/order-status.type';
import type { OrderStatus } from '../../shared/types/order-status.type';

export class UpdateOrderStatusDto {
  @IsEnum(Object.values(ORDER_STATUS))
  readonly status!: OrderStatus;

  @IsString()
  @IsOptional()
  readonly reason?: string;
}
