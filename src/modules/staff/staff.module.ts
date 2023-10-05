import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { StaffProvider } from './staff.provider';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from '../auth/auth.module';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [UserModule, MailModule],
  controllers: [StaffController],
  providers: [StaffService, ...StaffProvider],
  exports: [StaffService],
})
export class StaffModule {}
