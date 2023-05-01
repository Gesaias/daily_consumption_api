import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AirportsService } from './airports.service';

@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Get('update/cache')
  @HttpCode(HttpStatus.OK)
  async updateCacheAirports(): Promise<void> {
    return await this.airportsService.updateCacheAirports();
  }
}
