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
import { TicketService } from './ticket.service';
import { TransactionInterceptor } from 'src/common/interceptors';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { Transaction } from 'sequelize';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Roles(Role.Admin, Role.User)
  @Post()
  @UseInterceptors(TransactionInterceptor)
  async create(
    @User() user: any,
    @Body() createTicketDto: CreateTicketDto,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.ticketService.create(user.id, createTicketDto, transaction);
  }

  @Roles(Role.Admin)
  @Post('assign/:staffId')
  @UseInterceptors(TransactionInterceptor)
  async assignStaffToTickets(
    @Body('ticketIds') ticketIds: number[],
    @Param('staffId') staffId: number,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.ticketService.assignStaffToTickets(
      ticketIds,
      staffId,
      transaction,
    );
  }

  @Get('view')
  async viewTickets(@User() user: any) {
    return this.ticketService.viewTickets(user.id);
  }

  @Roles(Role.supportStaff)
  @Post('schedule/:ticketId')
  @UseInterceptors(TransactionInterceptor)
  async scheduleTicket(
    @User() user: any,
    @Param('ticketId') ticketId: number,
    @Body('scheduled_date') scheduled_date: Date,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.ticketService.scheduleTicket(
      user.id,
      ticketId,
      scheduled_date,
      transaction,
    );
  }
}
