import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_NAMES } from '../../queue/constants/queue-names.constant';
import { DEFAULT_JOB_OPTIONS } from '../../queue/constants/job-options.constant';
import { OrderProcessingJobData } from '../../queue/types/order-job.type';

@Injectable()
export class OrderQueueProducer {
  constructor(
    @InjectQueue(QUEUE_NAMES.ORDER_PROCESSING) private readonly orderQueue: Queue,
  ) {}

  async enqueueOrderProcessing(data: OrderProcessingJobData): Promise<void> {
    await this.orderQueue.add('process-order', data, {
      ...DEFAULT_JOB_OPTIONS,
      priority: data.priority,
    });
  }
}
