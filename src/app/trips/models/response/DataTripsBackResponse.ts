import { IDataOptionsResponse } from './DataOptionsResponse';
import { IDataSummaryResponse } from './DataSummaryResponse';

export interface IDataTripsBackResponse {
  summary: IDataSummaryResponse;
  options: IDataOptionsResponse[];
}
