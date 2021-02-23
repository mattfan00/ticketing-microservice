import { TicketCreatedEvent } from "@mattfan00-ticketing/common"
import { TicketCreatedListener } from "../ticket-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import Ticket from "../../../models/ticket"

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // Create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "my ticket",
    price: 10,
    userId: "123",
    version: 0,
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup()

  // Call the onMessage function with the data object and message object
  await listener.onMessage(data, msg)

  // Make sure the ticket was created
  const tickets = await Ticket.find({})
  expect(tickets.length).toBe(1)
  expect(tickets[0].id).toBe(data.id)

  // Make sure ack function is called
  expect(msg.ack).toHaveBeenCalled()
})
