import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @Min(0)
  readonly price!: number;

  @IsNumber()
  @IsOptional()
  readonly preparationTimeMinutes?: number;

  @IsUUID()
  readonly categoryId!: string;

  @IsString()
  @IsOptional()
  readonly station?: string;
}
