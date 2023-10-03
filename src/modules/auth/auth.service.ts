import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CustomLogger } from 'src/common/loggers/winston.logger';
import { CheckItemExistance, checkItemDuplicate } from 'src/common/utils';
import { UserService } from '../../../src/modules/user/user.service';
import { CreateUserDto } from '../../../src/modules/user/dtos/create-user.dto';
import { MailService } from '../mail/mail.service';
import { Transaction } from 'sequelize';
import { generateToken } from 'src/common/utils/generate-confirmation-token';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,

    @Inject(MailService)
    private readonly mailService: MailService,
  ) {}

  private readonly logger = new CustomLogger();

  async signUp(createUserDto: CreateUserDto, transaction: any) {
    const { username, email } = createUserDto;
    const existingUser = await this.userService.findOneByUsername(username);

    checkItemDuplicate(existingUser, 'Username is already registered!');

    // Generate a confirmation token (you can use a library like `crypto` for this)
    const confirmationToken = generateToken();

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userService.create(
      {
        ...createUserDto,
        password: hashedPassword,
        registrationConfirmationToken: confirmationToken, // Store the confirmation token
        registrationConfirmationStatus: false, // Set confirmation status to false initially
      },
      transaction,
    );

    this.mailService.sendConfirmationEmail(
      email,
      'Confirm your registration',
      `Please click the following code to confirm your registration: ${confirmationToken}`,
    );

    this.logger.log(
      `Attempting to create user with username ${createUserDto.username}`,
    );
    return user;
  }

  async confirmRegistration(
    confirmationToken: string,
    transaction: Transaction,
  ) {
    const confirmationSuccessful = await this.userService.confirmRegistration(
      confirmationToken,
      transaction,
    );

    if (!confirmationSuccessful) {
      throw new HttpException('Confirmation failure', HttpStatus.BAD_REQUEST);
    }

    return { message: 'Confirmation success!' };
  }

  async signIn(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);

    CheckItemExistance(user, 'User not found!', this.logger);

    if (user.registrationConfirmationStatus === false) {
      throw new HttpException(
        'You are not authorized to login to the system!',
        HttpStatus.FORBIDDEN,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.error(`Invalid username or password`);
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.FORBIDDEN,
      );
    }

    const payload = { id: user.id };

    this.logger.log(
      `SignIn user with username ${username} and password ${password}`,
    );
    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
