import {
  Controller,
  Body,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Public, User } from 'src/common/decorator';
import { Role } from 'src/common/constants';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserService } from './user.service';

@Roles(Role.Admin)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAllUsers() {
    return this.userService.findAll();
  }

  @Public()
  @Get(':id')
  async findUser(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user) {
    return this.userService.update(+id, updateUserDto, user.id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @User() user) {
    return this.userService.remove(+id, user.id);
  }
}