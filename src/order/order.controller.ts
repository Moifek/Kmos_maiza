import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrderService } from './services/order.service';
import { CreateOrderDto } from './models/create-order.dto';
import { UpdateOrderStatusDto } from './models/update-order-status.dto';
import { Order } from './entities/order.entity';
import { PublicRoute } from '../core/decorators/public-route.decorator';
import { PaginationQueryDto } from '../shared/models/pagination-query.dto';
import type { PaginatedResult } from '../shared/types';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('test')
  @PublicRoute()
  @ApiOperation({ summary: 'Orders smoke test' })
  @ApiOkResponse({ description: 'Service health status' })
  test(): { status: string } {
    return { status: 'ok' };
  }

  @Get()
  @ApiOperation({ summary: 'List orders' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Page size' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Page offset' })
  @ApiOkResponse({ description: 'Paginated orders result' })
  findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResult<Order>> {
    return this.orderService.findAll({ limit: query.limit, offset: query.offset });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiOkResponse({ description: 'Order details', type: Order })
  findById(@Param('id') id: string): Promise<Order> {
    return this.orderService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create order' })
  @ApiOkResponse({ description: 'Created order', type: Order })
  create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiOkResponse({ description: 'Updated order', type: Order })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto): Promise<Order> {
    return this.orderService.updateStatus(id, dto);
  }
}
