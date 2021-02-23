import { TicketUpdatedEvent } from "@mattfan00-ticketing/common"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import Ticket from "../../../models/ticket"

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10,
  })

  // Create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: newTicket.id,
    title: "my updated ticket",
    price: 100,
    userId: "123",
    version: 1,
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, newTicket, data, msg }
}

it("successfully updates the ticket and acknowledges", async () => {
  const { listener, newTicket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(newTicket.id)
  expect(updatedTicket!.title).toBe(data.title)
  expect(updatedTicket!.price).toBe(data.price)
  expect(updatedTicket!.version).toBe(data.version)

  expect(msg.ack).toHaveBeenCalled()
})

it("does not call ack if there is events out of order", async () => {
  const { listener, newTicket, data, msg } = await setup()
  data.version = 10

  try {
    await listener.onMessage(data, msg)
  } catch(err) {}

  expect(msg.ack).not.toHaveBeenCalled()
})
