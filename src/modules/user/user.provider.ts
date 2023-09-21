import { REPOSITORIES } from 'src/common/constants';
import { User } from './user.model';

export const UserProvider = [
  {
    provide: REPOSITORIES.USER_REPOSITORY,
    useFactory: () => {
      return User;
    },
  },
];