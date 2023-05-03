import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { TripsService } from './trips.service';
import { SearchTripsDto } from './dto/search-trip.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get('search/:origin/:destiny/:going/:back?')
  @ApiParam({ name: 'origin', type: 'string', example: 'POA' })
  @ApiParam({ name: 'destiny', type: 'string', example: 'MAO' })
  @ApiParam({ name: 'going', type: 'string', example: '2023-05-02' })
  @ApiParam({ name: 'back', type: 'string', example: '2023-05-05' })
  @HttpCode(HttpStatus.OK)
  async getData(
    @Param('origin') origin: string,
    @Param('destiny') destiny: string,
    @Param('going') going: string,
    @Param('back') back?: string,
  ) {
    return await this.tripsService.getTrips({ origin, destiny, going, back });
  }
}
