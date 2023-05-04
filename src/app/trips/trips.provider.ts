import { momentProvider } from 'src/utils/moment/moment.provider';
import * as moment from 'moment';

export const tripsProviders: {
  provide: string;
  useFactory: () => typeof moment;
}[] = [momentProvider];
