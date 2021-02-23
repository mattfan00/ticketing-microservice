import {
  Listener,
  Subjects,
  OrderCancelledEvent
} from "@mattfan00-ticketing/common"
import { Message } from "node-nats-streaming"
import Ticket from "../../models/ticket"
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher"

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: OrderCancelledEvent["subject"] = Subjects.OrderCancelled
  queueGroupName = "tickets-service"

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const foundTicket = await Ticket.findById(data.ticket.id)

    if (!foundTicket) {
      throw new Error("ticket not found")
    }

    // unreserve the ticket
    foundTicket.set({
      orderId: undefined
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