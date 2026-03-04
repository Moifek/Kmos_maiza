import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MenuService } from './services/menu.service';
import { CreateMenuCategoryDto } from './models/create-menu-category.dto';
import { CreateMenuItemDto } from './models/create-menu-item.dto';
import { UpdateMenuItemDto } from './models/update-menu-item.dto';
import { MenuCategory } from './entities/menu-category.entity';
import { MenuItem } from './entities/menu-item.entity';
import { Roles } from '../core/decorators/roles.decorator';
import { USER_ROLE } from '../shared/types/user-role.type';
import { PublicRoute } from '../core/decorators/public-route.decorator';
import { PaginationQueryDto } from '../shared/models/pagination-query.dto';
import type { PaginatedResult } from '../shared/types';

@ApiTags('menu')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('test')
  @PublicRoute()
  @ApiOperation({ summary: 'Menu smoke test' })
  @ApiOkResponse({ description: 'Service health status' })
  test(): { status: string } {
    return { status: 'ok' };
  }

  @Get('categories')
  @ApiOperation({ summary: 'List menu categories' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Page size' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Page offset' })
  @ApiOkResponse({ description: 'Paginated categories result' })
  findAllCategories(@Query() query: PaginationQueryDto): Promise<PaginatedResult<MenuCategory>> {
    return this.menuService.findAllCategories({ limit: query.limit, offset: query.offset });
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get menu category by id' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiOkResponse({ description: 'Category details', type: MenuCategory })
  findCategoryById(@Param('id') id: string): Promise<MenuCategory> {
    return this.menuService.findCategoryById(id);
  }

  @Post('categories')
  @Roles(USER_ROLE.ADMIN, USER_ROLE.MANAGER)
  @ApiOperation({ summary: 'Create menu category' })
  @ApiOkResponse({ description: 'Created category', type: MenuCategory })
  createCategory(@Body() dto: CreateMenuCategoryDto): Promise<MenuCategory> {
    return this.menuService.createCategory(dto);
  }

  @Get('items')
  @ApiOperation({ summary: 'List menu items' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Page size' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Page offset' })
  @ApiOkResponse({ description: 'Paginated menu items result' })
  findAllItems(@Query() query: PaginationQueryDto): Promise<PaginatedResult<MenuItem>> {
    return this.menuService.findAllItems({ limit: query.limit, offset: query.offset });
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get menu item by id' })
  @ApiParam({ name: 'id', description: 'Menu item ID' })
  @ApiOkResponse({ description: 'Menu item details', type: MenuItem })
  findItemById(@Param('id') id: string): Promise<MenuItem> {
    return this.menuService.findItemById(id);
  }

  @Post('items')
  @Roles(USER_ROLE.ADMIN, USER_ROLE.MANAGER)
  @ApiOperation({ summary: 'Create menu item' })
  @ApiOkResponse({ description: 'Created menu item', type: MenuItem })
  createItem(@Body() dto: CreateMenuItemDto): Promise<MenuItem> {
    return this.menuService.createItem(dto);
  }

  @Patch('items/:id')
  @Roles(USER_ROLE.ADMIN, USER_ROLE.MANAGER)
  @ApiOperation({ summary: 'Update menu item' })
  @ApiParam({ name: 'id', description: 'Menu item ID' })
  @ApiOkResponse({ description: 'Updated menu item', type: MenuItem })
  updateItem(@Param('id') id: string, @Body() dto: UpdateMenuItemDto): Promise<MenuItem> {
    return this.menuService.updateItem(id, dto);
  }
}
