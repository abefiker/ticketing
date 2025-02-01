import { Subjects, TicketUpdatedEvent, Publisher } from '@abticketing21/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subjects: Subjects.TicketUpdated = Subjects.TicketUpdated;
}