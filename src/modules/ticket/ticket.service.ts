import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REPOSITORIES } from 'src/common/constants';
import { CustomLogger } from 'src/common/loggers/winston.logger';
import { CheckItemExistance } from 'src/common/utils';
import { Transaction } from 'sequelize';
import { Ticket } from './ticket.model';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { StaffService } from '../staff/staff.service';

@Injectable()
export class TicketService {
  constructor(
    @Inject(REPOSITORIES.TICKET_REPOSITORY)
    private ticketRepository: typeof Ticket,
    private userService: UserService,
    private mailService: MailService,
    private staffService: StaffService,
  ) {}

  private readonly logger = new CustomLogger();

  async create(
    userId: number,
    createTicketDto: CreateTicketDto,
    transaction: Transaction,
  ) {
    const user = await this.userService.findOne(userId);
    CheckItemExistance(user);

    if (!user.registrationConfirmationStatus) {
      throw new HttpException(
        'User must confirm its registration to be able to add a new ticket',
        HttpStatus.FORBIDDEN,
      );
    }

    const ticket = await this.ticketRepository.create(
      {
        ...createTicketDto,
        userId: user.id,
        status: 'open',
        createdBy: user.id,
        createdAt: new Date(),
      },
      { transaction },
    );

    this.mailService.sendConfirmationEmail(
      user.email,
      'Create a new ticket',
      `You just created a ticket with category : ${createTicketDto.category}`,
    );

    this.logger.log(`Attempting to create ticket `);
    return ticket;
  }

  async assignStaffToTickets(
    ticketIds: number[],
    staffId: number,
    transaction: Transaction,
  ) {
    const staff = await this.staffService.findOne(staffId);
    const user = await this.userService.findOne(staff.userId);

    if (!staff.invitationStatus) {
      throw new HttpException(
        'Staff is not invited to the system!',
        HttpStatus.FORBIDDEN,
      );
    }

    const tickets = await this.ticketRepository.findAll({
      where: { id: ticketIds },
    });

    if (tickets.length !== ticketIds.length) {
      throw new HttpException(
        'One or more tickets not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    await Promise.all(
      tickets.map(async (ticket) => {
        ticket.assignedStaffId = staff.id;
        ticket.status = 'Assigned';
        await ticket.save({ transaction });
      }),
    );

    this.mailService.sendConfirmationEmail(
      user.email,
      'Assigned to tickets',
      `You just assigned to many tickes!`,
    );

    return { message: `Tickets Assigned to staff : ${staff.id}` };
  }

  async viewTickets(userId: number) {
    return await this.ticketRepository.findAll({ where: { userId } });
  }

  async scheduleTicket(
    staffId: number,
    ticketId: number,
    scheduled_date: Date,
    transaction: Transaction,
  ) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
    });
    CheckItemExistance(ticket, 'Ticket is not found!');

    const user = await this.userService.findOne(staffId); //14 => userId
    const staff = await this.staffService.findStaffByUserId(user.id); // 2 => staffId
    if (ticket.assignedStaffId !== staff.id) {
      throw new HttpException(
        'Staff is not assignd to this ticket!',
        HttpStatus.BAD_REQUEST,
      );
    }
    ticket.scheduled_date = scheduled_date;
    ticket.status = 'Scheduled';
    ticket.updatedBy = staffId;
    ticket.save({ transaction });

    return { message: `Ticket ${ticket.id} is scheduled by staff ${staff.id}` };
  }
}
