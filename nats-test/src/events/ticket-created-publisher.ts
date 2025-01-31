import { Publisher } from './base-publisher';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-events';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subjects: Subjects.TicketCreated = Subjects.TicketCreated;
}
