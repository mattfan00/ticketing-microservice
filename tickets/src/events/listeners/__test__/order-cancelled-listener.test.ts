import { OrderCancelledEvent, OrderStatus } from "@mattfan00-ticketing/common"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import Ticket from "../../../models/ticket"

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client)

  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10,
    userId: "321",
  })
  newTicket.set({
    orderId: new mongoose.Types.ObjectId().toHexString()
  })
  await newTicket.save()

  // Create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: newTicket.id,
    }
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, newTicket, data, msg }
}

it("successfully cancels order and acknowledges", async () => {
  const { listener, newTicket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const foundTicket = await Ticket.findById(newTicket.id)
  expect(foundTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
})

it("emits a ticket updated event", async () => {
  const { listener, newTicket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

