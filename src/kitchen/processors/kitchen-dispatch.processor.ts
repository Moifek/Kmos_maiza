import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../../queue/constants/queue-names.constant';
import { KitchenDispatchJobData } from '../../queue/types/order-job.type';
import { KitchenService } from '../services/kitchen.service';

@Processor(QUEUE_NAMES.KITCHEN_DISPATCH)
export class KitchenDispatchProcessor extends WorkerHost {
  private readonly logger = new Logger(KitchenDispatchProcessor.name);

  constructor(private readonly kitchenService: KitchenService) {
    super();
  }

  async process(job: Job<KitchenDispatchJobData>): Promise<void> {
    this.logger.log(`Dispatching order ${job.data.orderNumber} to station ${job.data.stationId}`);
    const ticket = await this.kitchenService.createTicketForDispatch({
      orderId: job.data.orderId,
      stationId: job.data.stationId,
      priority: job.data.priority,
    });
    this.logger.log(
      `Created/used ticket ${ticket.id} for order ${job.data.orderNumber}. Items routed: ${job.data.items.length}`,
    );
  }
}
