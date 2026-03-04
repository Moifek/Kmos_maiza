import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KitchenOrderTicket } from './kitchen/entities/kitchen-order-ticket.entity';
import { KitchenStation } from './kitchen/entities/kitchen-station.entity';
import { KitchenDispatchProcessor } from './kitchen/processors/kitchen-dispatch.processor';
import { KitchenService } from './kitchen/services/kitchen.service';
import { OrderProcessingProcessor } from './order/processors/order-processing.processor';
import { NotificationsProcessor } from './shared/processors/notifications.processor';
import { QueueModule } from './queue/queue.module';
import { SharedModule } from './shared/shared.module';
import { OrderQueueProducer } from './order/producers/order-queue.producer';

/** Root worker module for queue processors only. */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature([KitchenStation, KitchenOrderTicket]),
    SharedModule,
    QueueModule,
  ],
  providers: [KitchenService, OrderQueueProducer, OrderProcessingProcessor, KitchenDispatchProcessor, NotificationsProcessor],
})
export class WorkerModule {}
