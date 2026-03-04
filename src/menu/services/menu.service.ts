import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { CreateMenuCategoryDto } from '../models/create-menu-category.dto';
import { CreateMenuItemDto } from '../models/create-menu-item.dto';
import { UpdateMenuItemDto } from '../models/update-menu-item.dto';
import type { PaginatedResult, PaginationParams } from '../../shared/types';

@Injectable()
export class MenuService {
  constructor(private readonly em: EntityManager) {}

  async findAllCategories(pagination: PaginationParams): Promise<PaginatedResult<MenuCategory>> {
    const [data, total] = await this.em.findAndCount(
      MenuCategory,
      {},
      {
        populate: ['items'],
        orderBy: { sortOrder: 'ASC' },
        limit: pagination.limit,
        offset: pagination.offset,
      },
    );
    return { data, total, limit: pagination.limit, offset: pagination.offset };
  }

  async findCategoryById(id: string): Promise<MenuCategory> {
    const category = await this.em.findOne(MenuCategory, { id }, { populate: ['items'] });
    if (!category) {
      throw new NotFoundException(`Menu category ${id} not found`);
    }
    return category;
  }

  async createCategory(dto: CreateMenuCategoryDto): Promise<MenuCategory> {
    const category = this.em.create(MenuCategory, {
      name: dto.name,
      description: dto.description,
      sortOrder: dto.sortOrder ?? 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.em.persistAndFlush(category);
    return category;
  }

  async findAllItems(pagination: PaginationParams): Promise<PaginatedResult<MenuItem>> {
    const [data, total] = await this.em.findAndCount(
      MenuItem,
      {},
      {
        populate: ['category', 'modifiers'],
        orderBy: { createdAt: 'DESC' },
        limit: pagination.limit,
        offset: pagination.offset,
      },
    );
    return { data, total, limit: pagination.limit, offset: pagination.offset };
  }

  async findItemById(id: string): Promise<MenuItem> {
    const item = await this.em.findOne(MenuItem, { id }, { populate: ['category', 'modifiers'] });
    if (!item) {
      throw new NotFoundException(`Menu item ${id} not found`);
    }
    return item;
  }

  async createItem(dto: CreateMenuItemDto): Promise<MenuItem> {
    const category = await this.em.findOneOrFail(MenuCategory, { id: dto.categoryId });
    const item = this.em.create(MenuItem, {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      preparationTimeMinutes: dto.preparationTimeMinutes ?? 0,
      category,
      station: dto.station,
      isAvailable: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.em.persistAndFlush(item);
    return item;
  }

  async updateItem(id: string, dto: UpdateMenuItemDto): Promise<MenuItem> {
    const item = await this.findItemById(id);
    if (dto.categoryId) {
      const category = await this.em.findOneOrFail(MenuCategory, { id: dto.categoryId });
      item.category = category;
    }
    this.em.assign(item, { ...dto, categoryId: undefined });
    await this.em.flush();
    return item;
  }
}
