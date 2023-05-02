import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { tripsProviders } from './trips.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TripsController],
  providers: [TripsService, ...tripsProviders],
  exports: [],
})
export class TripsModule {}
