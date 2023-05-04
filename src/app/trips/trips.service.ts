import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
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
import { IDataTripsBackResponse } from './models/response/DataTripsBackResponse';
import { IDataSummaryResponse } from './models/response/DataSummaryResponse';
import { IDataOptionsResponse } from './models/response/DataOptionsResponse';

@Injectable()
export class TripsService {
  constructor(
    @Inject(MOMENT_PACKAGE) private readonly day: typeof moment,

    private readonly http: HttpService,

    private readonly logger: Logger = new Logger(TripsService.name),

    private readonly airportsService: AirportsService,
  ) {}

  async getTrips(dto: SearchTripsDto): Promise<{
    msg: string;
    data: TripsRequestFromService | IDataTripsBackResponse;
  }> {
    try {
      await this.validationsDataTrips(dto);
    } catch (error) {
      this.logger.error('There was an error searching for available tickets!');
      throw error['response'];
    }

    const tripsService: TripsRequestFromService[] = await this.findData(dto);

    if (!tripsService[0]) {
      throw new NotFoundException('Destination not found for this date!');
    }

    return {
      msg: 'Trips found successfully!',
      data: dto.back
        ? await this.mountDataGoingBack(tripsService)
        : await this.mountDataGoing(tripsService),
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

  private async mountDataGoing(
    data: TripsRequestFromService[],
  ): Promise<TripsRequestFromService> {
    const trip: TripsRequestFromService = data[0];

    trip.options = trip.options.map((option: OptionsFromService) => {
      const dateDeparture: Date = new Date(option.departure_time);

      if (this.day(dateDeparture).isAfter(this.day())) return option;
    });

    trip.options = trip.options.filter(
      (value: OptionsFromService) => value !== null && value !== undefined,
    );

    return trip;
  }

  private async mountDataGoingBack(
    data: TripsRequestFromService[],
  ): Promise<IDataTripsBackResponse> {
    function getPrice(
      priceGoing: PriceFromService,
      priceBack: PriceFromService,
    ): PriceFromService {
      const price: PriceFromService = {
        fare: Number((priceGoing.fare + priceBack.fare).toFixed(2)),
        fees: Number((priceGoing.fees + priceBack.fees).toFixed(1)),
        total: Number((priceGoing.total + priceBack.total).toFixed(2)),
      };
      return price;
    }

    const goingService: TripsRequestFromService = data[0];
    const backService: TripsRequestFromService = data[1];

    const summary: IDataSummaryResponse = {
      departure_date: this.day(goingService.summary.departure_date).format(
        'YYYY/MM/DD',
      ),
      back_date: this.day(backService.summary.departure_date).format(
        'YYYY/MM/DD',
      ),
      currency: goingService.summary.currency,
      going: { from: goingService.summary.from, to: goingService.summary.to },
      back: { from: backService.summary.from, to: backService.summary.to },
    };

    const options: IDataOptionsResponse[] = [];

    goingService.options.forEach((going) => {
      backService.options.forEach((back: OptionsFromService) => {
        const dateGoingDeparture: Date = new Date(going.departure_time);
        const dateGoingArrival: Date = new Date(going.arrival_time);
        const dateBackDeparture: Date = new Date(back.departure_time);

        if (
          this.day(dateBackDeparture).isAfter(this.day(dateGoingArrival)) &&
          this.day(dateGoingDeparture).isAfter(this.day())
        ) {
          const option: IDataOptionsResponse = {
            going: {
              departure_time: going.departure_time.toString(),
              arrival_time: going.arrival_time.toString(),
              aircraft: going.aircraft,
              meta: going.meta,
            },
            back: {
              departure_time: back.departure_time.toString(),
              arrival_time: back.arrival_time.toString(),
              aircraft: back.aircraft,
              meta: back.meta,
            },
            price: getPrice(going.price, back.price),
          };

          options.push(option);
        }
      });
    });

    options.sort((a, b) => a.price.total - b.price.total);

    const resp: IDataTripsBackResponse = {
      summary,
      options,
    };

    return resp;
  }

  private async validationsDataTrips(dto: SearchTripsDto): Promise<void> {
    if (dto.origin === dto.destiny) {
      throw new BadRequestException(
        'The source must be different from the selected destination.',
      );
    }

    if (
      this.day(dto.going).isBefore(this.day().format('YYYY-MM-DD')) ||
      this.day(dto.back).isBefore(this.day().format('YYYY-MM-DD')) ||
      this.day(dto.back).isBefore(this.day(dto.going))
    ) {
      throw new BadRequestException('Invalid dates!');
    }

    const toAirport: Airport = await this.airportsService.findByIata(
      dto.origin,
    );

    const fromAirport: Airport = await this.airportsService.findByIata(
      dto.destiny,
    );

    if (!toAirport || !fromAirport) {
      throw new BadRequestException('Airport unavailable!');
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

  private calculateTime(date1: Date, date2: Date): number {
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
