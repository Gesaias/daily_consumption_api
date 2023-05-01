import { DataSource } from 'typeorm';
import { City } from './entities/cities.entity';
import { DATA_SOURCE, CITIES_REPOSITORY } from '../../constants/providers';

export const citiesProviders = [
  {
    provide: CITIES_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(City),
    inject: [DATA_SOURCE],
  },
];
