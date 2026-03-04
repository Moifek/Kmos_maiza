import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LocationService } from './services/location.service';
import { CreateLocationDto } from './models/create-location.dto';
import { UpdateLocationDto } from './models/update-location.dto';
import { Location } from './entities/location.entity';
import { Roles } from '../core/decorators/roles.decorator';
import { USER_ROLE } from '../shared/types/user-role.type';
import { PublicRoute } from '../core/decorators/public-route.decorator';
import { PaginationQueryDto } from '../shared/models/pagination-query.dto';
import type { PaginatedResult } from '../shared/types';

@ApiTags('locations')
@ApiBearerAuth()
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('test')
  @PublicRoute()
  @ApiOperation({ summary: 'Locations smoke test' })
  @ApiOkResponse({ description: 'Service health status' })
  test(): { status: string } {
    return { status: 'ok' };
  }

  @Get()
  @ApiOperation({ summary: 'List locations' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Page size' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Page offset' })
  @ApiOkResponse({ description: 'Paginated locations result' })
  findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResult<Location>> {
    return this.locationService.findAll({ limit: query.limit, offset: query.offset });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get location by id' })
  @ApiParam({ name: 'id', description: 'Location ID' })
  @ApiOkResponse({ description: 'Location details', type: Location })
  findById(@Param('id') id: string): Promise<Location> {
    return this.locationService.findById(id);
  }

  @Post()
  @Roles(USER_ROLE.ADMIN, USER_ROLE.MANAGER)
  @ApiOperation({ summary: 'Create location' })
  @ApiOkResponse({ description: 'Created location', type: Location })
  create(@Body() dto: CreateLocationDto): Promise<Location> {
    return this.locationService.create(dto);
  }

  @Patch(':id')
  @Roles(USER_ROLE.ADMIN, USER_ROLE.MANAGER)
  @ApiOperation({ summary: 'Update location' })
  @ApiParam({ name: 'id', description: 'Location ID' })
  @ApiOkResponse({ description: 'Updated location', type: Location })
  update(@Param('id') id: string, @Body() dto: UpdateLocationDto): Promise<Location> {
    return this.locationService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(USER_ROLE.ADMIN)
  @ApiOperation({ summary: 'Delete location' })
  @ApiParam({ name: 'id', description: 'Location ID' })
  @ApiNoContentResponse({ description: 'Location deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.locationService.remove(id);
  }
}
