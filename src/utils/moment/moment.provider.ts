import { MOMENT_PACKAGE } from '../constants/providers';
import * as moment from 'moment';

export const momentProvider: {
  provide: string;
  useFactory: () => typeof moment;
} = {
  provide: MOMENT_PACKAGE,
  useFactory: () => moment,
};
