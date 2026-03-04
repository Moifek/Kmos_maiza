import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LocationController } from './location.controller';
import { LocationService } from './services/location.service';
import { Location } from './entities/location.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Location])],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
