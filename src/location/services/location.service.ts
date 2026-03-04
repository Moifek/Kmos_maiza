import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Location } from '../entities/location.entity';
import { CreateLocationDto } from '../models/create-location.dto';
import { UpdateLocationDto } from '../models/update-location.dto';
import type { PaginatedResult, PaginationParams } from '../../shared/types';

@Injectable()
export class LocationService {
  constructor(private readonly em: EntityManager) {}

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Location>> {
    const [data, total] = await this.em.findAndCount(Location, {}, { limit: pagination.limit, offset: pagination.offset });
    return { data, total, limit: pagination.limit, offset: pagination.offset };
  }

  async findById(id: string): Promise<Location> {
    const location = await this.em.findOne(Location, { id });
    if (!location) {
      throw new NotFoundException(`Location ${id} not found`);
    }
    return location;
  }

  async create(dto: CreateLocationDto): Promise<Location> {
    const location = this.em.create(Location, {
      name: dto.name,
      address: dto.address,
      timezone: dto.timezone,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.em.persistAndFlush(location);
    return location;
  }

  async update(id: string, dto: UpdateLocationDto): Promise<Location> {
    const location = await this.findById(id);
    this.em.assign(location, dto);
    await this.em.flush();
    return location;
  }

  async remove(id: string): Promise<void> {
    const location = await this.findById(id);
    await this.em.removeAndFlush(location);
  }
}
