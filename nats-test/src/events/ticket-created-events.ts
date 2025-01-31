import { Subjects } from './subjects';

export interface TicketCreatedEvent {
  subjects: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
