import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { OrderService } from './services/order.service';
import { CreateOrderDto } from './models/create-order.dto';
import { Order } from './entities/order.entity';
import { PublicRoute } from '../core/decorators/public-route.decorator';
import { ApiKeyAuthGuard } from '../core/guards/api-key-auth.guard';

@ApiTags('pos-orders')
@Controller('pos/orders')
export class PosOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('test')
  @PublicRoute()
  @ApiOperation({ summary: 'POS orders smoke test' })
  @ApiOkResponse({ description: 'Service health status' })
  test(): { status: string } {
    return { status: 'ok' };
  }

  @Post()
  @PublicRoute()
  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({ summary: 'Create POS order' })
  @ApiSecurity('x-api-key')
  @ApiHeader({ name: 'x-api-key', required: true, description: 'POS API key' })
  @ApiOkResponse({ description: 'Created order', type: Order })
  create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(dto);
  }
}
