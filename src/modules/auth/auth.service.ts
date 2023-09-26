import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CustomLogger } from 'src/common/loggers/winston.logger';
import { CheckItemExistance, checkItemDuplicate, generateConfirmationToken } from 'src/common/utils';
import { UserService } from '../../../src/modules/user/user.service';
import { CreateUserDto } from '../../../src/modules/user/dtos/create-user.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,

    @Inject(MailService)
    private readonly mailService: MailService,
  ) { }

  private readonly logger = new CustomLogger();

  async signUp(createUserDto: CreateUserDto, transaction: any) {
    const { username, email } = createUserDto;
    const existingUser = await this.userService.findOneByUsername(username);

    checkItemDuplicate(existingUser, 'Username is already registered!');

    // Generate a confirmation token (you can use a library like `crypto` for this)
    const confirmationToken = generateConfirmationToken();

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

    // Send a confirmation email with a link/token
    const confirmationLink = `https://realtime.com/confirm/${confirmationToken}`;
    this.mailService.sendConfirmationEmail(email, 'Confirm your registration', `Please click the following link to confirm your registration: ${confirmationLink}`);

    this.logger.log(
      `Attempting to create user with username ${createUserDto.username}`,
    );
    return user;
  }

  async signIn(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);

    CheckItemExistance(user, 'User not found!', this.logger);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.error(`Invalid username or password`);
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.FORBIDDEN,
      );
    }

    // TODO:return all the user object except password //Done ,,
    // but i think i won't use all user proparites , i just use userId

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