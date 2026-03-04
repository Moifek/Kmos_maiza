import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  readonly username!: string;

  @IsString()
  @MinLength(6)
  readonly password!: string;
}
