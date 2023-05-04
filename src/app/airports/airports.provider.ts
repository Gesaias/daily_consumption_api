import { DataSource, Repository } from 'typeorm';
import { Airport } from './entities/airport.entity';
import {
  DATA_SOURCE,
  AIRPORTS_REPOSITORY,
} from '../../utils/constants/providers';

export const airportsProviders: {
  provide: string;
  useFactory: (dataSource: DataSource) => Repository<Airport>;
  inject: string[];
}[] = [
  {
    provide: AIRPORTS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Airport),
    inject: [DATA_SOURCE],
  },
];
