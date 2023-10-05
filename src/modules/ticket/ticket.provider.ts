import { REPOSITORIES } from 'src/common/constants';
import { Ticket } from './ticket.model';

export const TicketProvider = [
  {
    provide: REPOSITORIES.TICKET_REPOSITORY,
    useFactory: () => {
      return Ticket;
    },
  },
];
