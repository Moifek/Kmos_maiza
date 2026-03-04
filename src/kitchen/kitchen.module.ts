import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { KitchenController } from './kitchen.controller';
import { KitchenService } from './services/kitchen.service';
import { KitchenDisplayGateway } from './gateway/kitchen-display.gateway';
import { KitchenStation } from './entities/kitchen-station.entity';
import { KitchenOrderTicket } from './entities/kitchen-order-ticket.entity';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [MikroOrmModule.forFeature([KitchenStation, KitchenOrderTicket]), QueueModule],
  controllers: [KitchenController],
  providers: [KitchenService, KitchenDisplayGateway],
  exports: [KitchenService, KitchenDisplayGateway],
})
export class KitchenModule {}
