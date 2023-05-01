import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AIRPORTS_REPOSITORY } from 'src/constants/providers';
import { Repository } from 'typeorm';
import { Airport } from './entities/airport.entity';
import { City } from '../cities/entities/cities.entity';
import { CitiesService } from '../cities/cities.service';
import { HttpService } from '@nestjs/axios';
import httpConfig from 'src/config/http.config';
import { CreateCityDto } from '../cities/dto/create-city.dto';
import { AxiosResponse } from 'axios';

@Injectable()
export class AirportsService {
  constructor(
    @Inject(AIRPORTS_REPOSITORY)
    private readonly airportsRepository: Repository<Airport>,
    private readonly http: HttpService,

    private readonly citiesServices: CitiesService,

    private readonly logger: Logger = new Logger(AirportsService.name),
  ) {}

  // Job
  @Cron('0 5 00 * * *')
  async updateCacheAirports(): Promise<void> {
    const data: [any] | Promise<Airport>[] = <any>[];

    await this.http
      .get(`${httpConfig().urlService}/air/airports/${httpConfig().keyService}`)
      .forEach((value: AxiosResponse<any, any>) => {
        for (const key in value.data) {
          if (value.data.hasOwnProperty(key)) {
            data.push(value.data[key]);
          }
        }
      });

    data.forEach(async (value: any) => {
      const mountCity: CreateCityDto = {
        name: value.city,
        state: value.state,
      };

      const city: City = await this.citiesServices.createOrReturn(mountCity);

      if (!city) {
        throw new NotFoundException(
          'Não foi possivel encontrar a cidade referente',
        );
      }

      const airport: Airport = await this.airportsRepository.findOne({
        where: { iata: value.iata },
      });

      const airportInstance: Airport = this.airportsRepository.create({
        id: airport ? airport.id : undefined,
        iata: value.iata,
        lat: value.lat,
        lon: value.lon,
        city: city,
        created_at: airport ? airport.created_at : undefined,
      });

      await this.airportsRepository.save(airportInstance);
    });

    this.logger.log('updated sucessfully!', 'updateCacheAirports');
  }
}
