import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { USER_ROLE } from '../../shared/types/user-role.type';
import type { UserRole } from '../../shared/types/user-role.type';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ unique: true })
  username!: string;

  @Property()
  passwordHash!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  fullName!: string;

  @Enum({ items: () => Object.values(USER_ROLE), default: USER_ROLE.CASHIER })
  role: UserRole = USER_ROLE.CASHIER;

  @Property({ nullable: true })
  locationId?: string;

  @Property({ default: true })
  isActive: boolean = true;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
