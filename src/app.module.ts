import { Module } from '@nestjs/common';
import config from 'config';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/db/database.module';
import { CustomLogger } from './common/loggers/winston.logger';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true
    }),
],
  controllers: [ AuthController],
  providers: [ AuthService, CustomLogger],
})
export class AppModule {}