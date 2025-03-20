import { OrderStatus, OrderCancelledEvent } from "@abticketing21/common"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { Message } from "node-nats-streaming"
import mongoose from "mongoose"
import { Order } from "../../../models/order"

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString()
  })
  await order.save()
  const data: OrderCancelledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString()
    }
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  return { listener, data, msg, order }
}
it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup()
  await listener.onMessage(data, msg)
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})
it('acks the message', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data,msg)
    expect(msg.ack).toHaveBeenCalled()
  })