import { REPOSITORIES } from 'src/common/constants';
import { Staff } from './staff.model';

export const StaffProvider = [
  {
    provide: REPOSITORIES.STAFF_REPOSITORY,
    useFactory: () => {
      return Staff;
    },
  },
];