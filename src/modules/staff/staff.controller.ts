import {
  Controller,
  Body,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { Public, User } from 'src/common/decorator';
import { Role } from 'src/common/constants';
import { Roles } from 'src/common/decorator/roles.decorator';
import { StaffService } from './staff.service';

// @Roles(Role.Admin)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // @Get()
  // async findAllUsers() {
  //   return this.userService.findAll();
  // }

  // @Public()
  // @Get(':id')
  // async findUser(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user) {
  //   return this.userService.update(+id, updateUserDto, user.id);
  // }

  // @Delete(':id')
  // async deleteUser(@Param('id') id: string, @User() user) {
  //   return this.userService.remove(+id, user.id);
  // }
}