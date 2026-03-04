import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { ORDER_SOURCE } from '../../shared/types/order-source.type';
import type { OrderSource } from '../../shared/types/order-source.type';

export class CreateOrderItemDto {
  @IsUUID()
  readonly menuItemId!: string;

  @IsNumber()
  @Min(1)
  readonly quantity!: number;

  @IsString()
  @IsOptional()
  readonly notes?: string;
}

export class CreateOrderDto {
  @IsEnum(Object.values(ORDER_SOURCE))
  readonly source!: OrderSource;

  @IsUUID()
  readonly locationId!: string;

  @IsString()
  @IsOptional()
  readonly customerName?: string;

  @IsString()
  @IsOptional()
  readonly notes?: string;

  @IsNumber()
  @IsOptional()
  readonly priority?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  readonly items!: CreateOrderItemDto[];
}
