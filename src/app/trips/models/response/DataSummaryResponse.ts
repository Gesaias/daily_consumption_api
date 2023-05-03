import { IDataSummaryTripResponse } from './DataSummaryTripResponse';

export interface IDataSummaryResponse {
  departure_date: string;
  back_date: string;
  currency: string;
  going: IDataSummaryTripResponse;
  back: IDataSummaryTripResponse;
}
