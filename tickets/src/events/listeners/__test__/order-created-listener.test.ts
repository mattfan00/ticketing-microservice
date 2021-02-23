import { OrderCreatedEvent, OrderStatus } from "@mattfan00-ticketing/common"
import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import Ticket from "../../../models/ticket"

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client)

  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10,
    userId: "321"
  })

  // Create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: "123",
    expiresAt: "12345",
    version: 0,
    ticket: {
      id: newTicket.id,
      price: 10
    }
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, newTicket, data, msg }
}

it("successfully updates ticket with the orderId and acknowledges", async () => {
  const { listener, newTicket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const foundTicket = await Ticket.findById(newTicket.id)
  expect(foundTicket!.orderId).toEqual(data.id)
  expect(msg.ack).toHaveBeenCalled()
})

it("emits a ticket updated event", async () => {
  const { listener, newTicket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

