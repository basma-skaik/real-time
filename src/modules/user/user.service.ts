import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { REPOSITORIES } from 'src/common/constants';
import { CustomLogger } from 'src/common/loggers/winston.logger';
import { CheckItemExistance } from 'src/common/utils';
import { User } from './user.model';
import { Transaction } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORIES.USER_REPOSITORY)
    private userRepository: typeof User,
  ) {}

  private readonly logger = new CustomLogger();

  async create(createUserDto: CreateUserDto, transaction: any) {
    const user = await this.userRepository.create(createUserDto, {
      transaction,
    });
    this.logger.log(
      `Attempting to create user with username ${createUserDto.username}`,
    );
    return user;
  }

  async confirmRegistration(
    confirmationToken: string,
    transaction: Transaction,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { registrationConfirmationToken: confirmationToken },
    });

    CheckItemExistance(user);

    if (user.registrationConfirmationStatus) {
      throw new HttpException(
        'User has already been confirmed!',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.registrationConfirmationStatus = true;

    await user.save({ transaction });
    return true;
  }

  async findAll() {
    this.logger.log(`Attempting to find all users`);
    return this.userRepository.findAll();
  }

  async findAllByIds(userIds: number[]) {
    this.logger.log(`Attempting to find all users by IDs: ${userIds}`);
    return this.userRepository.findAll({
      where: {
        id: userIds,
      },
    });
  }

  async findOne(id: number, options?: any) {
    const user = await this.userRepository.findOne({
      where: { id },
      ...options,
    });

    CheckItemExistance(user, 'User not found!');

    this.logger.log(`Attempting to find user with id ${id}`);
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  async update(id: number, attrs: UpdateUserDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    CheckItemExistance(user, 'User not found!');

    await user.update({
      ...attrs,
      updatedBy: userId,
    });
    this.logger.log(`Attempting to update user with id ${id}`);
    return user;
  }

  async remove(id: number, userId: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    CheckItemExistance(user, 'User not found!');

    // Perform soft delete
    user.deletedAt = new Date();
    user.deletedBy = userId;
    this.logger.log(`Attempting to remove user with id ${id}`);
    return user.save();
  }
}
