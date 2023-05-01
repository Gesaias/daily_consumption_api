import { DataSource } from 'typeorm';
import { Airport } from './entities/airport.entity';
import { DATA_SOURCE, AIRPORTS_REPOSITORY } from '../../constants/providers';

export const airportsProviders = [
  {
    provide: AIRPORTS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Airport),
    inject: [DATA_SOURCE],
  },
];
