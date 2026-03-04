import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class UpdateMenuItemDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly price?: number;

  @IsNumber()
  @IsOptional()
  readonly preparationTimeMinutes?: number;

  @IsUUID()
  @IsOptional()
  readonly categoryId?: string;

  @IsString()
  @IsOptional()
  readonly station?: string;

  @IsBoolean()
  @IsOptional()
  readonly isAvailable?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}
