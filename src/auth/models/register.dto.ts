import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { USER_ROLE } from '../../shared/types/user-role.type';
import type { UserRole } from '../../shared/types/user-role.type';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  readonly username!: string;

  @IsString()
  @MinLength(6)
  readonly password!: string;

  @IsEmail()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly fullName!: string;

  @IsEnum(Object.values(USER_ROLE))
  @IsOptional()
  readonly role?: UserRole;

  @IsString()
  @IsOptional()
  readonly locationId?: string;
}
