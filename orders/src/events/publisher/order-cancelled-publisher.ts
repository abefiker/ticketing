import { Subjects, OrderCancelledEvent, Publisher } from '@abticketing21/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subjects: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
