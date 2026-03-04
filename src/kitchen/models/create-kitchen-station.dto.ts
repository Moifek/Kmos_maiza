import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateKitchenStationDto {
  @IsString()
  @MaxLength(100)
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsUUID()
  @IsOptional()
  readonly locationId?: string;

  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  readonly sortOrder?: number;
}
