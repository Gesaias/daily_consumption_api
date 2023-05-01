import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { DatabaseModule } from 'src/database/database.module';
import { citiesProviders } from './cities.provider';

@Module({
  imports: [DatabaseModule],
  providers: [CitiesService, ...citiesProviders],
  exports: [CitiesService],
})
export class CitiesModule {}
