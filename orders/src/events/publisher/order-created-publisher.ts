import { Subjects, OrderCreatedEvent, Publisher } from '@abticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated= Subjects.OrderCreated;
}
