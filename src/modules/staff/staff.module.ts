import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { StaffProvider } from './staff.provider';

@Module({
  controllers: [StaffController],
  providers: [StaffService, ...StaffProvider],
  exports: [StaffService],
})
export class StaffModule {}