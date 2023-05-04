import { Logger, Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { tripsProviders } from './trips.provider';
import { DatabaseModule } from 'src/database/database.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AirportsModule } from '../airports/airports.module';

@Module({
  imports: [
    DatabaseModule,
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
    AirportsModule,
  ],
  controllers: [TripsController],
  providers: [TripsService, ...tripsProviders, Logger],
})
export class TripsModule {}
