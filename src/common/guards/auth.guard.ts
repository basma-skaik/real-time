import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { CustomLogger } from '../loggers/winston.logger';
import { RolesGuard } from './roles.guard';
import { CheckItemExistance } from '../utils';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, 
    private readonly reflector: Reflector,
    private userService: UserService) {}

    private readonly logger = new CustomLogger();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      this.logger.log('Public route - Access allowed without authentication')
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) {
      this.logger.error('Unauthorized: Token not found in request header')
      throw new HttpException('Unauthorized: Token not found in request header', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.verify(token,{ secret: process.env.SECRET || 'jfsgksfgjsk'})

    CheckItemExistance(payload, 'Payload not found!')

    const user = await this.userService.findOne(payload.id)

    CheckItemExistance(user, 'user not found!')

    request.user = user.get({ plain: true });

    const roleGuard = new RolesGuard(this.reflector);

    return roleGuard.canActivate(context);
  }
}