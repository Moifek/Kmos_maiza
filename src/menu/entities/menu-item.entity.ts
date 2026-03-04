import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import type { MenuCategory } from './menu-category.entity';
import type { MenuModifier } from './menu-modifier.entity';

@Entity({ tableName: 'menu_items' })
export class MenuItem {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Property({ default: 0 })
  preparationTimeMinutes: number = 0;

  @ManyToOne('MenuCategory')
  category!: MenuCategory;

  @Property({ nullable: true })
  station?: string;

  @Property({ default: true })
  isAvailable: boolean = true;

  @Property({ default: true })
  isActive: boolean = true;

  @OneToMany('MenuModifier', (modifier) => modifier.menuItem, { orphanRemoval: true })
  modifiers = new Collection<MenuModifier>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
