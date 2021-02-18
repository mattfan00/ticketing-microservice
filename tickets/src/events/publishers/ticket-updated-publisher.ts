import { Publisher, Subjects, TicketUpdatedEvent } from "@mattfan00-ticketing/common"

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: TicketUpdatedEvent['subject'] = Subjects.TicketUpdated
}