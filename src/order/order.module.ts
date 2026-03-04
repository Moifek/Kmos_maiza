import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrderController } from './order.controller';
import { PosOrderController } from './pos-order.controller';
import { PublicOrderController } from './public-order.controller';
import { OrderService } from './services/order.service';
import { OrderQueueProducer } from './producers/order-queue.producer';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { QueueModule } from '../queue/queue.module';
import { ApiKeyAuthGuard } from '../core/guards/api-key-auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MikroOrmModule.forFeature([Order, OrderItem]), QueueModule, ConfigModule],
  controllers: [OrderController, PosOrderController, PublicOrderController],
  providers: [OrderService, OrderQueueProducer, ApiKeyAuthGuard],
  exports: [OrderService],
})
export class OrderModule {}
