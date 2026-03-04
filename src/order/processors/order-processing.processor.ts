import { EntityManager } from '@mikro-orm/postgresql';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { MenuItem } from '../../menu/entities/menu-item.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';
import { QUEUE_NAMES } from '../../queue/constants/queue-names.constant';
import { DEFAULT_JOB_OPTIONS } from '../../queue/constants/job-options.constant';
import { KitchenDispatchItem, KitchenDispatchJobData, OrderProcessingJobData } from '../../queue/types/order-job.type';
import { KitchenStation } from '../../kitchen/entities/kitchen-station.entity';

@Processor(QUEUE_NAMES.ORDER_PROCESSING)
export class OrderProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderProcessingProcessor.name);

  constructor(
    private readonly em: EntityManager,
    @InjectQueue(QUEUE_NAMES.KITCHEN_DISPATCH) private readonly kitchenDispatchQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<OrderProcessingJobData>): Promise<void> {
    this.logger.log(`Processing order ${job.data.orderNumber} (${job.data.orderId})`);
    const order = await this.findOrder(job.data.orderId);
    if (!order) {
      this.logger.warn(`Order ${job.data.orderId} not found, skipping`);
      return;
    }
    const stations = await this.findActiveStations(order.location.id);
    if (stations.length === 0) {
      this.logger.warn(`No active stations for location ${order.location.id}. Order ${order.id} cannot be dispatched`);
      return;
    }
    const groupedItems = this.groupItemsByStation(order.items.getItems(), stations);
    for (const [stationId, items] of groupedItems.entries()) {
      const dispatchJobData: KitchenDispatchJobData = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        stationId,
        priority: job.data.priority,
        items,
      };
      await this.kitchenDispatchQueue.add('dispatch-to-station', dispatchJobData, {
        ...DEFAULT_JOB_OPTIONS,
        priority: job.data.priority,
      });
    }
    this.logger.log(`Order ${job.data.orderNumber} dispatched to ${groupedItems.size} station(s)`);
  }

  private async findOrder(orderId: string): Promise<Order | null> {
    return this.em.findOne(
      Order,
      { id: orderId },
      { populate: ['items.menuItem', 'location'] },
    );
  }

  private async findActiveStations(locationId: string): Promise<readonly KitchenStation[]> {
    return this.em.find(
      KitchenStation,
      { isActive: true, $or: [{ locationId }, { locationId: null }] },
      { orderBy: { sortOrder: 'ASC', name: 'ASC' } },
    );
  }

  private groupItemsByStation(
    orderItems: readonly OrderItem[],
    stations: readonly KitchenStation[],
  ): Map<string, KitchenDispatchItem[]> {
    const groupedItems = new Map<string, KitchenDispatchItem[]>();
    const stationByName = this.buildStationByNameMap(stations);
    const defaultStation = stations[0];
    for (const orderItem of orderItems) {
      const station = this.resolveStation(orderItem.menuItem, stationByName, defaultStation);
      if (!station) {
        continue;
      }
      const existingItems = groupedItems.get(station.id) ?? [];
      existingItems.push({
        orderItemId: orderItem.id,
        menuItemId: orderItem.menuItem.id,
        quantity: orderItem.quantity,
        notes: orderItem.notes,
      });
      groupedItems.set(station.id, existingItems);
    }
    return groupedItems;
  }

  private buildStationByNameMap(stations: readonly KitchenStation[]): Map<string, KitchenStation> {
    const stationByName = new Map<string, KitchenStation>();
    for (const station of stations) {
      stationByName.set(this.normalizeStationName(station.name), station);
    }
    return stationByName;
  }

  private resolveStation(
    menuItem: MenuItem,
    stationByName: Map<string, KitchenStation>,
    defaultStation: KitchenStation | undefined,
  ): KitchenStation | undefined {
    const configuredStationName = menuItem.station;
    if (!configuredStationName) {
      return defaultStation;
    }
    const station = stationByName.get(this.normalizeStationName(configuredStationName));
    return station ?? defaultStation;
  }

  private normalizeStationName(value: string): string {
    return value.trim().toLowerCase();
  }
}
