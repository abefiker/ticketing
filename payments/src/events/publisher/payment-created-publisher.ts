import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from '@abticketing21/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subjects: Subjects.PaymentCreated = Subjects.PaymentCreated;
}