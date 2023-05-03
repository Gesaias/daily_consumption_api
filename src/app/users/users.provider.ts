import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { DATA_SOURCE, USERS_REPOSITORY } from '../../utils/constants/providers';

export const usersProviders = [
  {
    provide: USERS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  },
];
