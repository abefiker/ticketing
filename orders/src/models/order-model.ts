import mongoose from 'mongoose';
import { OrderStatus } from '@abticketing/common';
import { TicketDoc } from './ticket';
export { OrderStatus };
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
// an interface that describes the properties
// that are required to create a new Order
interface OrderAttributes {
  status: OrderStatus;
  expiresAt: Date;
  userId: string;
  ticket: TicketDoc;
}
// an interface that describes the properties
// that a Order model has
interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attribute: OrderAttributes): OrderDocument;
}

// an interface that describes the properties
// that a Order document has
interface OrderDocument extends mongoose.Document<any> {
  status: OrderStatus;
  expiresAt: Date;
  userId: string;
  ticket: TicketDoc;
  version:number
}

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
OrderSchema.set('versionKey', 'version');
OrderSchema.plugin(updateIfCurrentPlugin);
OrderSchema.statics.build = (attributes: OrderAttributes) => {
  return new Order(attributes);
};
const Order = mongoose.model<OrderDocument, OrderModel>('Order', OrderSchema);

export { Order };
