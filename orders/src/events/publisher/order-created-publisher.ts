import { Subjects, OrderCreatedEvent, Publisher } from '@abticketing21/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subjects: Subjects.OrderCreated= Subjects.OrderCreated;
}
