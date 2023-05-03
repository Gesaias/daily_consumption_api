import { AircraftFromService } from '../AircraftFromService';
import { MetaFromService } from '../MetaFromService';

export interface IDataOptionsTripResponse {
  departure_time: string;
  arrival_time: string;
  aircraft: AircraftFromService;
  meta: MetaFromService;
}
