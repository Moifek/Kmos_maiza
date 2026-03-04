import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrapWorker(): Promise<void> {
  const appContext = await NestFactory.createApplicationContext(WorkerModule);
  const logger = new Logger('WorkerBootstrap');
  logger.log('Worker started and listening for queue jobs');
  const shutdownSignals: readonly NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  shutdownSignals.forEach((signal) => {
    process.on(signal, async () => {
      logger.log(`Received ${signal}, shutting down worker`);
      await appContext.close();
      process.exit(0);
    });
  });
}

void bootstrapWorker();
