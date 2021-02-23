import { OrderStatus, ExpirationCompletedEvent } from "@mattfan00-ticketing/common"
import { ExpirationCompletedListener } from "../expiration-completed-listener"
import { natsWrapper } from "../../../nats-wrapper"
import Order from "../../../models/order"
import Ticket from "../../../models/ticket"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"

const setup = async () => {
  const listener = new ExpirationCompletedListener(natsWrapper.client)

  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 0,
    userId: "123"
  })

  const newOrder = await Order.create({
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: newTicket.id
  })

  const data: ExpirationCompletedEvent["data"] = {
    orderId: newOrder.id
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, newTicket, newOrder, data, msg }
}

it("cancels the order when it expires and acknowledges", async () => {
  const { listener, newOrder, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const foundOrder = await Order.findById(newOrder.id)

  expect(foundOrder!.status).toEqual(OrderStatus.Cancelled)
  expect(msg.ack).toHaveBeenCalled()
})

it("emits the order:cancelled event", async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})