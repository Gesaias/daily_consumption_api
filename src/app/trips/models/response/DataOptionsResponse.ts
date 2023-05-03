import { PriceFromService } from '../PriceFromService';
import { IDataOptionsTripResponse } from './DataOptionsTripResponse';

export interface IDataOptionsResponse {
  going: IDataOptionsTripResponse;
  back: IDataOptionsTripResponse;
  price: PriceFromService;
}
