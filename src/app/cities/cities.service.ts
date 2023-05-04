import { Inject, Injectable } from '@nestjs/common';
import { CITIES_REPOSITORY } from 'src/utils/constants/providers';
import { Repository } from 'typeorm';
import { City } from './entities/cities.entity';
import { CreateCityDto } from './dto/create-city.dto';

@Injectable()
export class CitiesService {
  constructor(
    @Inject(CITIES_REPOSITORY)
    private readonly citiesRepository: Repository<City>,
  ) {}

  async createOrReturn(dto: CreateCityDto): Promise<City> {
    const findCity: City = await this.citiesRepository.findOne({
      where: { name: dto.name },
    });

    if (findCity) {
      return findCity;
    }

    const cityInstance: City = this.citiesRepository.create({
      name: dto.name,
      state: dto.state,
    });

    try {
      return await this.citiesRepository.save(cityInstance);
    } catch (error) {
      throw new Error(error);
    }
  }
}
