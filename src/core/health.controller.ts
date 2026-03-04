import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { PublicRoute } from './decorators/public-route.decorator';

@ApiTags('health')
@Controller('health')
@SkipThrottle()
export class HealthController {
  @Get()
  @PublicRoute()
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ description: 'Application health status' })
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}
