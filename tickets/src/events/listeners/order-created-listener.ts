import {
  Listener,
  Subjects,
  OrderCreatedEvent
} from "@mattfan00-ticketing/common"
import { Message } from "node-nats-streaming"
import Ticket from "../../models/ticket"
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher"

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: OrderCreatedEvent["subject"] = Subjects.OrderCreated
  queueGroupName = "tickets-service"

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const foundTicket = await Ticket.findById(data.ticket.id)

    if (!foundTicket) {
      throw new Error("ticket not found")
    }

    // reserve the ticket
    foundTicket.set({
      orderId: data.id
    })

    await foundTicket.save()

    // need to emit event saying that the ticket has been updated
    await new TicketUpdatedPublisher(this.client).publish({
      id: foundTicket.id,
      title: foundTicket.title,
      price: foundTicket.price,
      userId: foundTicket.userId,
      orderId: foundTicket.orderId,
      version: foundTicket.version
    })

    msg.ack()
  }
}