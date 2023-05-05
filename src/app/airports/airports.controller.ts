import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AirportsService } from './airports.service';
import { UpdateStatusAirportsDto } from './dto/alter-status-airports.dto';

@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Get('update/cache')
  @HttpCode(HttpStatus.OK)
  async updateCacheAirports(): Promise<void> {
    return await this.airportsService.updateCacheAirports();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.airportsService.findAll();
  }

  @Post('alter_status/:id/:newStatus')
  @HttpCode(HttpStatus.OK)
  async alterStatus(
    @Param('id') id: string,
    @Param('newStatus') newStatus: string,
    @Body() data: UpdateStatusAirportsDto,
  ) {
    return this.airportsService.alterStatus(
      Number(id),
      Number(newStatus),
      data,
    );
  }
}
