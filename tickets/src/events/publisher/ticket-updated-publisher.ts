import { Subjects, TicketUpdateEvent, Publisher } from '@abticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdateEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}