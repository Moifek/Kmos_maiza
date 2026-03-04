import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import type { MenuItem } from './menu-item.entity';

@Entity({ tableName: 'menu_modifiers' })
export class MenuModifier {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne('MenuItem')
  menuItem!: MenuItem;

  @Property()
  name!: string;

  @Property({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number = 0;

  @Property({ default: true })
  isActive: boolean = true;

  @Property()
  createdAt: Date = new Date();
}
