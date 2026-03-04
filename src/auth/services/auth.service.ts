import { EntityManager } from '@mikro-orm/postgresql';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { LoginDto } from '../models/login.dto';
import { RegisterDto } from '../models/register.dto';
import { AuthResponse, AuthUserPayload } from '../models/auth-response.type';
import { USER_ROLE } from '../../shared/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.em.findOne(User, {
      $or: [{ username: dto.username }, { email: dto.email }],
    });
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }
    const user = this.em.create(User, {
      username: dto.username,
      passwordHash: await Bun.password.hash(dto.password),
      email: dto.email,
      fullName: dto.fullName,
      role: dto.role ?? USER_ROLE.CASHIER,
      locationId: dto.locationId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.em.persistAndFlush(user);
    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.em.findOne(User, { username: dto.username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await Bun.password.verify(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: User): AuthResponse {
    const payload: AuthUserPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      locationId: user.locationId,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: payload,
    };
  }
}
