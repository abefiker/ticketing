import { Subjects, TicketCreatedEvent, Publisher } from '@abticketing21/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subjects: Subjects.TicketCreated = Subjects.TicketCreated;
}
