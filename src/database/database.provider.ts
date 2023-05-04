import { DataSource, DataSourceOptions } from 'typeorm';
import databaseConfig from '../config/database.config';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { SeederOptions } from 'typeorm-extension';
import { DATA_SOURCE } from 'src/utils/constants/providers';
import { MainSeeder } from './seeds/main.seeder';

dotenvExpand.expand(dotenv.config());

const optionsDataProviders: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: databaseConfig().host,
  port: databaseConfig().port,
  username: databaseConfig().username,
  password: databaseConfig().password,
  database: databaseConfig().name,
  schema: databaseConfig().schema,
  logging: databaseConfig().logging,
  synchronize: databaseConfig().synchronize,
  entities: [__dirname + '/../../dist/app/**/*.entity.js'],
  seeds: [MainSeeder],
};

const optionsDataSource: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: databaseConfig().host,
  port: databaseConfig().port,
  username: databaseConfig().username,
  password: databaseConfig().password,
  database: databaseConfig().name,
  schema: databaseConfig().schema,
  migrationsRun: databaseConfig().migrationsRun,
  synchronize: databaseConfig().synchronize,
  entities: [__dirname + '/../../dist/app/**/*.entity.js'],
  migrations: [],
  seeds: [MainSeeder],
};

export const databaseProviders: {
  provide: string;
  useFactory: () => Promise<DataSource>;
}[] = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource(optionsDataProviders);

      return dataSource.initialize();
    },
  },
];

export const dataSource = new DataSource(optionsDataSource);
