import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { KitchenService } from './services/kitchen.service';
import { KitchenStation } from './entities/kitchen-station.entity';
import { KitchenOrderTicket } from './entities/kitchen-order-ticket.entity';
import type { TicketStatus } from './entities/kitchen-order-ticket.entity';
import { PublicRoute } from '../core/decorators/public-route.decorator';
import { CreateKitchenStationDto } from './models/create-kitchen-station.dto';
import { UpdateKitchenStationDto } from './models/update-kitchen-station.dto';
import { PaginationQueryDto } from '../shared/models/pagination-query.dto';
import { USER_ROLE } from '../shared/types';
import type { PaginatedResult } from '../shared/types';
import { Roles } from '../core/decorators/roles.decorator';

@ApiTags('kitchen')
@ApiBearerAuth()
@Controller('kitchen')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get('test')
  @PublicRoute()
  @ApiOperation({ summary: 'Kitchen smoke test' })
  @ApiOkResponse({ description: 'Service health status' })
  test(): { status: string } {
    return { status: 'ok' };
  }

  @Get('stations')
  @ApiOperation({ summary: 'List kitchen stations' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Page size' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Page offset' })
  @ApiOkResponse({ description: 'Paginated stations result' })
  findAllStations(@Query() query: PaginationQueryDto): Promise<PaginatedResult<KitchenStation>> {
    return this.kitchenService.findAllStations({ limit: query.limit, offset: query.offset });
  }

  @Post('stations')
  @Roles(USER_ROLE.ADMIN, USER_ROLE.MANAGER)
  @ApiOperation({ summary: 'Create kitchen station' })
  @ApiOkResponse({ description: 'Created station', type: KitchenStation })
  createStation(@Body() dto: CreateKitchenStationDto): Promise<KitchenStation> {
    return this.kitchenService.createStation(dto);
  }

  @Patch('stations/:id')
  @Roles(USER_ROLE.ADMIN, USER_ROLE.MANAGER)
  @ApiOperation({ summary: 'Update kitchen station' })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiOkResponse({ description: 'Updated station', type: KitchenStation })
  updateStation(@Param('id') id: string, @Body() dto: UpdateKitchenStationDto): Promise<KitchenStation> {
    return this.kitchenService.updateStation(id, dto);
  }

  @Delete('stations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(USER_ROLE.ADMIN)
  @ApiOperation({ summary: 'Delete kitchen station' })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiNoContentResponse({ description: 'Kitchen station deleted' })
  removeStation(@Param('id') id: string): Promise<void> {
    return this.kitchenService.removeStation(id);
  }

  @Get('stations/:id/tickets')
  @ApiOperation({ summary: 'List tickets for station' })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiOkResponse({ description: 'Station ticket list', type: KitchenOrderTicket, isArray: true })
  findTicketsByStation(@Param('id') stationId: string): Promise<KitchenOrderTicket[]> {
    return this.kitchenService.findTicketsByStation(stationId);
  }

  @Get('tickets/active')
  @ApiOperation({ summary: 'List active kitchen tickets' })
  @ApiOkResponse({ description: 'Active ticket list', type: KitchenOrderTicket, isArray: true })
  findActiveTickets(): Promise<KitchenOrderTicket[]> {
    return this.kitchenService.findActiveTickets();
  }

  @Patch('tickets/:id/status')
  @ApiOperation({ summary: 'Update kitchen ticket status' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiQuery({ name: 'status', required: true, enum: ['pending', 'in_progress', 'completed', 'voided'] })
  @ApiOkResponse({ description: 'Updated ticket', type: KitchenOrderTicket })
  updateTicketStatus(
    @Param('id') ticketId: string,
    @Query('status') status: TicketStatus,
  ): Promise<KitchenOrderTicket> {
    return this.kitchenService.updateTicketStatus(ticketId, status);
  }
}
