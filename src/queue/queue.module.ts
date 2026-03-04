import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { REDIS_KEY_PREFIX } from '../shared/constants/app.constant';
import { QUEUE_NAMES } from './constants/queue-names.constant';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.getOrThrow<string>('REDIS_HOST'),
          port: config.getOrThrow<number>('REDIS_PORT'),
        },
        prefix: REDIS_KEY_PREFIX,
      }),
    }),
    BullModule.registerQueue(
      { name: QUEUE_NAMES.ORDER_PROCESSING },
      { name: QUEUE_NAMES.KITCHEN_DISPATCH },
      { name: QUEUE_NAMES.NOTIFICATIONS },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
