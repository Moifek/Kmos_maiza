import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import Redis from 'ioredis';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { ThrottlerRedisStorage } from './core/storage/throttler-redis.storage';
import { KitchenModule } from './kitchen/kitchen.module';
import { LocationModule } from './location/location.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { SharedModule } from './shared/shared.module';
import {
  THROTTLE_AUTH_LIMIT,
  THROTTLE_AUTH_NAME,
  THROTTLE_AUTH_TTL_MS,
  THROTTLE_DEFAULT_LIMIT,
  THROTTLE_DEFAULT_NAME,
  THROTTLE_DEFAULT_TTL_MS,
} from './shared/constants/app.constant';

/** Root HTTP application module. */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: THROTTLE_DEFAULT_NAME,
            ttl: Number(config.get('THROTTLE_DEFAULT_TTL_MS') ?? THROTTLE_DEFAULT_TTL_MS),
            limit: Number(config.get('THROTTLE_DEFAULT_LIMIT') ?? THROTTLE_DEFAULT_LIMIT),
          },
          {
            name: THROTTLE_AUTH_NAME,
            ttl: Number(config.get('THROTTLE_AUTH_TTL_MS') ?? THROTTLE_AUTH_TTL_MS),
            limit: Number(config.get('THROTTLE_AUTH_LIMIT') ?? THROTTLE_AUTH_LIMIT),
          },
        ],
        storage: new ThrottlerRedisStorage(
          new Redis({
            host: config.getOrThrow<string>('REDIS_HOST'),
            port: Number(config.getOrThrow<string>('REDIS_PORT')),
          }),
        ),
      }),
    }),
    MikroOrmModule.forRoot(),
    SharedModule,
    CoreModule,
    AuthModule,
    LocationModule,
    MenuModule,
    OrderModule,
    KitchenModule,
  ],
})
export class AppModule {}
