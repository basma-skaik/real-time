import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { DATABASE_CONFIG, PROVIDERS } from 'src/common/constants';
import { TransactionInterceptorProvider } from 'src/common/interceptors/transaction.interceptor';
import { User } from '../../../src/modules/user/user.model';
import { Staff } from '../staff/staff.model';

// Create a factory function to provide Sequelize instance
export const sequelizeFactory = {
  provide: Sequelize,
  useFactory: (configService: ConfigService) => {
    return new Sequelize({
      ...configService.get(DATABASE_CONFIG),
      logging: false,
    });
  },
  inject: [ConfigService],
};

export const databaseProvider = [
  sequelizeFactory, // Provide Sequelize instance using the factory function
  {
    provide: PROVIDERS.DATABASE_PROVIDER,
    useFactory: (sequelize: Sequelize) => {
      sequelize.addModels([
        User,
        Staff
      ]);
      return sequelize;
    },
    inject: [Sequelize],
  },
  TransactionInterceptorProvider, // Add the TransactionInterceptorProvider to the providers
];