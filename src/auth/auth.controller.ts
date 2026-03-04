import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { PublicRoute } from '../core/decorators/public-route.decorator';
import {
  THROTTLE_AUTH_LIMIT,
  THROTTLE_AUTH_NAME,
  THROTTLE_AUTH_TTL_MS,
} from '../shared/constants/app.constant';
import { AuthResponse } from './models/auth-response.type';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { AuthService } from './services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('test')
  @PublicRoute()
  @SkipThrottle()
  @ApiOperation({ summary: 'Auth smoke test' })
  @ApiOkResponse({ description: 'Service health status' })
  test(): { status: string } {
    return { status: 'ok' };
  }

  @Post('register')
  @PublicRoute()
  @Throttle({ [THROTTLE_AUTH_NAME]: { limit: THROTTLE_AUTH_LIMIT, ttl: THROTTLE_AUTH_TTL_MS } })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ description: 'Authenticated user and access token' })
  register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Post('login')
  @PublicRoute()
  @Throttle({ [THROTTLE_AUTH_NAME]: { limit: THROTTLE_AUTH_LIMIT, ttl: THROTTLE_AUTH_TTL_MS } })
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiOkResponse({ description: 'Authenticated user and access token' })
  login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }
}
