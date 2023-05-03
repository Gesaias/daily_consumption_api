import { MOMENT_PACKAGE } from '../constants/providers';
import * as moment from 'moment';

export const momentProvider = {
  provide: MOMENT_PACKAGE,
  useFactory: () => moment,
};
