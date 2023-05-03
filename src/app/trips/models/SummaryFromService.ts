import { ToFromFromService } from './ToFromFromService';

export interface SummaryFromService {
  currency: string;
  departure_date: Date;
  from: ToFromFromService;
  to: ToFromFromService;
}
