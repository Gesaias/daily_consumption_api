import { OptionsFromService } from './OptionsFromService';
import { SummaryFromService } from './SummaryFromService';

export interface TripsRequestFromService {
  options: OptionsFromService[];
  summary: SummaryFromService;
}
