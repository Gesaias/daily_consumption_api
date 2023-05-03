import { Logger, Module } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { AirportsController } from './airports.controller';
import { DatabaseModule } from 'src/database/database.module';
import { airportsProviders } from './airports.provider';
import { CitiesModule } from '../cities/cities.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        auth: {
          username: configService.get<string>('SERVICE_USER'),
          password: configService.get<string>('SERVICE_PASS'),
        },
      }),
    }),
    DatabaseModule,
    CitiesModule,
  ],
  controllers: [AirportsController],
  providers: [AirportsService, ...airportsProviders, Logger],
  exports: [AirportsService],
})
export class AirportsModule {}
