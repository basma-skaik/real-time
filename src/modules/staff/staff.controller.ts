import {
  Controller,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionParam, User } from 'src/common/decorator';
import { Role } from 'src/common/constants';
import { Roles } from 'src/common/decorator/roles.decorator';
import { StaffService } from './staff.service';
import { TransactionInterceptor } from 'src/common/interceptors';
import { Transaction } from 'sequelize';
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Roles(Role.Admin)
  @Post('invintion/:userId')
  @UseInterceptors(TransactionInterceptor)
  async inviteSupportStaff(
    @Param('userId') userId: number,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.staffService.inviteSupportStaff(userId, transaction);
  }

  @Post('confirmInvintion')
  @UseInterceptors(TransactionInterceptor)
  async confirmInvitation(
    @Body('invitationToken') invitationToken: string,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.staffService.confirmInvitation(invitationToken, transaction);
  }
}
