import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  Options,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import httpConfig from 'src/config/http.config';
import { AxiosResponse } from 'axios';
import { MOMENT_PACKAGE } from 'src/utils/constants/providers';
import * as moment from 'moment';
import { SearchTripsDto } from './dto/search-trip.dto';
import { TripsRequestFromService } from './models/TripsRequestFromService';
import { AirportsService } from '../airports/airports.service';
import { Airport } from '../airports/entities/airport.entity';
import { PriceFromService } from './models/PriceFromService';
import { OptionsFromService } from './models/OptionsFromService';
import { MetaFromService } from './models/MetaFromService';
import { SummaryFromService } from './models/SummaryFromService';
import { UsingJoinColumnIsNotAllowedError } from 'typeorm';

@Injectable()
export class TripsService {
  constructor(
    @Inject(MOMENT_PACKAGE) private readonly day: typeof moment,

    private readonly http: HttpService,

    private readonly logger: Logger = new Logger(TripsService.name),

    private readonly airportsService: AirportsService,
  ) {}

  async getTrips(dto: SearchTripsDto): Promise<object> {
    try {
      await this.validationsDataTrips(dto);
    } catch (error) {
      this.logger.error('Houve um erro na busca de passagens disponiveis!');
      throw error['response'];
    }

    const data: TripsRequestFromService[] = await this.findData(dto);

    if (!data[0]) {
      throw new NotFoundException('Destino não encontrado para esta data!');
    }

    return {
      msg: 'Viagem encontrada com sucesso!',
      data: data,
    };
  }

  // Privates

  private async findData(
    dto: SearchTripsDto,
  ): Promise<TripsRequestFromService[]> {
    const datas: [any] | [TripsRequestFromService] = <any>[];

    if (!dto.back) {
      await this.http
        .get(
          `${httpConfig().urlService}/air/search/${httpConfig().keyService}/${
            dto.origin
          }/${dto.destiny}/${dto.going}`,
        )
        .forEach((value: AxiosResponse<any, any>) => {
          const trip: TripsRequestFromService = value.data;

          trip.options = trip.options.map((option) => {
            option.price = this.calculatePrice(option.price.fare);
            option.meta = this.calculateMeta(option, trip.summary);

            return option;
          });

          datas.push(trip);
        });

      return datas;
    }

    for (let i = 0; i < 2; i++) {
      const requestData: string = i < 1 ? dto.going : dto.back;

      await this.http
        .get(
          `${httpConfig().urlService}/air/search/${httpConfig().keyService}/${
            i < 1
              ? `${dto.origin}/${dto.destiny}`
              : `${dto.destiny}/${dto.origin}`
          }/${requestData}`,
        )
        .forEach((value: AxiosResponse<any, any>) => {
          const trip: TripsRequestFromService = value.data;

          trip.options = trip.options.map((option) => {
            option.price = this.calculatePrice(option.price.fare);
            option.meta = this.calculateMeta(option, trip.summary);

            return option;
          });

          datas.push(trip);
        });
    }

    return datas;
  }

  private async validationsDataTrips(dto: SearchTripsDto): Promise<void> {
    if (dto.origin === dto.destiny) {
      throw new BadRequestException(
        'A origem precisa ser diferente do destino selecionado.',
      );
    }

    if (
      this.day(dto.going).isBefore(this.day().format('YYYY-MM-DD')) ||
      this.day(dto.back).isBefore(this.day().format('YYYY-MM-DD')) ||
      this.day(dto.back).isBefore(this.day(dto.going))
    ) {
      throw new BadRequestException('Datas inválidas!');
    }

    const toAirport: Airport = await this.airportsService.findByIata(
      dto.origin,
    );

    const fromAirport: Airport = await this.airportsService.findByIata(
      dto.destiny,
    );

    if (!toAirport || !fromAirport) {
      throw new BadRequestException('Aeroporto indisponível!');
    }
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRadius(lat2 - lat1);
    const dLon = this.toRadius(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadius(lat1)) *
        Math.cos(this.toRadius(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return Number(d.toFixed());
  }

  private toRadius(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private calculateSpeed(
    distance: number,
    departureTime: Date,
    arrivalTime: Date,
  ): number {
    const hours: number = this.calculateTime(departureTime, arrivalTime);
    const speed: number = distance / hours;
    return Number(speed.toFixed());
  }

  private calculatePrice(fare: number): PriceFromService {
    const fees = Number(Math.max(40.0, fare * 0.1).toFixed(1));
    const total = Number((fare + fees).toFixed(2));
    return { fare, fees, total };
  }

  private calculateTime(date1: Date, date2: Date) {
    const difference: number = Math.abs(date2.getTime() - date1.getTime());

    const hours: number = Math.floor(difference / (1000 * 60 * 60));
    const minutes: number = Math.floor(
      (difference % (1000 * 60 * 60)) / (1000 * 60),
    );

    return Number(`${hours}.${minutes}`);
  }

  private calculateMeta(
    option: OptionsFromService,
    summary: SummaryFromService,
  ): MetaFromService {
    option.meta.range = this.calculateDistance(
      summary.from.lat,
      summary.from.lon,
      summary.to.lat,
      summary.to.lon,
    );

    option.meta.cruise_speed_kmh = this.calculateSpeed(
      option.meta.range,
      new Date(option.departure_time),
      new Date(option.arrival_time),
    );

    option.meta.cost_per_km = Number(
      (option.price.total / option.meta.range).toFixed(1),
    );

    return option.meta;
  }
}
