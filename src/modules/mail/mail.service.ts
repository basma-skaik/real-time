import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmationEmail(email: string, subject: string, text: string) {
    try {
      await this.mailerService.sendMail({
        from: 'basmahskaik@gmail.com',
        to: email,
        subject,
        text,
      });
    } catch (error) {
      throw new Error(`Error sending confirmation email: ${error}`);
    }
  }
}
