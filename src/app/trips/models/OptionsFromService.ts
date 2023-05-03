import { AircraftFromService } from './AircraftFromService';
import { MetaFromService } from './MetaFromService';
import { PriceFromService } from './PriceFromService';

export interface OptionsFromService {
  aircraft: AircraftFromService;
  arrival_time: Date;
  departure_time: Date;
  meta: MetaFromService;
  price: PriceFromService;
}
