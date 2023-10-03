import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REPOSITORIES, Role } from 'src/common/constants';
import { CustomLogger } from 'src/common/loggers/winston.logger';
import { CheckItemExistance, generateToken } from 'src/common/utils';
import { Staff } from './staff.model';
import { UserService } from '../user/user.service';
import { Transaction } from 'sequelize';
import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class StaffService {
  constructor(
    @Inject(REPOSITORIES.STAFF_REPOSITORY)
    private staffRepository: typeof Staff,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  private readonly logger = new CustomLogger();

  async inviteSupportStaff(userId: number, transaction: Transaction) {
    const user = await this.userService.findOne(userId);
    CheckItemExistance(user, 'User not found!');

    if (user.registrationConfirmationStatus === false) {
      throw new HttpException(
        'User not regist tot the system',
        HttpStatus.BAD_REQUEST,
      );
    }
    const invitationToken = generateToken();

    const staff = await this.staffRepository.create(
      {
        userId: user.id,
        invitationStatus: false, // Initial status is not accepted
        invitationToken: invitationToken,
      },
      { transaction },
    );
    this.mailService.sendConfirmationEmail(
      user.email,
      'invitation to Support Stuff',
      `Please click the following code to confirm your invitation:  ${invitationToken}`,
    );

    this.logger.log(
      `Attempting to invite user with username ${user.username} to support stuff`,
    );
    return { message: `Sending invintionToken to ${user.username}`, staff };
  }

  async confirmInvitation(invitationToken: string, transaction: Transaction) {
    const stuff = await this.staffRepository.findOne({
      where: { invitationToken },
    });

    CheckItemExistance(stuff);

    const user = await this.userService.findOne(stuff.userId);

    if (stuff.invitationStatus) {
      throw new HttpException(
        'User has already been invited!',
        HttpStatus.BAD_REQUEST,
      );
    }

    stuff.invitationStatus = true;
    user.role = Role.supportStaff;

    await stuff.save({ transaction });
    await user.save({ transaction });
    return { message: 'User accept invitation' };
  }
}
