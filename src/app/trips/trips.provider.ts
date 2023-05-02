import { DataSource } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { DATA_SOURCE, TRIPS_REPOSITORY } from '../../constants/providers';

export const tripsProviders = [
  {
    provide: TRIPS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Trip),
    inject: [DATA_SOURCE],
  },
];
