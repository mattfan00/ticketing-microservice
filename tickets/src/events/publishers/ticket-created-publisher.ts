import { Publisher, Subjects, TicketCreatedEvent } from "@mattfan00-ticketing/common"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: TicketCreatedEvent['subject'] = Subjects.TicketCreated
}