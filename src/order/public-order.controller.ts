import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from '../core/decorators/public-route.decorator';
import { ApiKeyAuthGuard } from '../core/guards/api-key-auth.guard';
import { CreateOrderDto } from './models/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './services/order.service';

@ApiTags('public-orders')
@Controller('public/orders')
export class PublicOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('test')
  @PublicRoute()
  @ApiOperation({ summary: 'Public orders smoke test' })
  @ApiOkResponse({ description: 'Service health status' })
  test(): { status: string } {
    return { status: 'ok' };
  }

  @Post()
  @PublicRoute()
  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({ summary: 'Create public integration order' })
  @ApiSecurity('x-api-key')
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Third-party API key' })
  @ApiOkResponse({ description: 'Created order', type: Order })
  create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(dto);
  }

  @Get(':id')
  @PublicRoute()
  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({ summary: 'Get public order by id' })
  @ApiSecurity('x-api-key')
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Third-party API key' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiOkResponse({ description: 'Order details', type: Order })
  findById(@Param('id') id: string): Promise<Order> {
    return this.orderService.findById(id);
  }
}
