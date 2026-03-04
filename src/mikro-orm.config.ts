import { defineConfig } from '@mikro-orm/postgresql';
import { User } from './auth/entities/user.entity';
import { KitchenOrderTicket } from './kitchen/entities/kitchen-order-ticket.entity';
import { KitchenStation } from './kitchen/entities/kitchen-station.entity';
import { Location } from './location/entities/location.entity';
import { MenuCategory } from './menu/entities/menu-category.entity';
import { MenuItem } from './menu/entities/menu-item.entity';
import { MenuModifier } from './menu/entities/menu-modifier.entity';
import { OrderItem } from './order/entities/order-item.entity';
import { Order } from './order/entities/order.entity';

function parsePort(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

const defaultPort = 5432;

export default defineConfig({
  entities: [User, Location, MenuCategory, MenuItem, MenuModifier, Order, OrderItem, KitchenStation, KitchenOrderTicket],
  clientUrl: process.env.DATABASE_URL,
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: parsePort(process.env.POSTGRES_PORT, defaultPort),
  user: process.env.POSTGRES_USER ?? 'koms',
  password: process.env.POSTGRES_PASSWORD ?? 'koms_secret',
  dbName: process.env.POSTGRES_DB ?? 'koms',
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    tableName: 'mikro_orm_migrations',
  },
});
