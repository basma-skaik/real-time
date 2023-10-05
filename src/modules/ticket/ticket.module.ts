import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketProvider } from './ticket.provider';
import { TicketController } from './ticket.controller';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { StaffModule } from '../staff/staff.module';

@Module({
  imports: [UserModule, MailModule, StaffModule],
  controllers: [TicketController],
  providers: [TicketService, ...TicketProvider],
  exports: [TicketService],
})
export class TicketModule {}
