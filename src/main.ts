import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './common/guards/auth.guard';
import { CustomLogger } from './common/loggers/winston.logger';
import { CustomExceptionFilter } from './common/exception.filter/custom-exception.filter';
import { AppModule } from './app.module';
import { UserService } from './modules/user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });

  app.useGlobalGuards(
    new AuthGuard(app.get(JwtService), new Reflector(), app.get(UserService)),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new CustomExceptionFilter(new CustomLogger()));

  await app.listen(3000);
}
bootstrap();