import {
  Publisher,
  Subjects,
  ExpirationCompletedEvent,
} from "@mattfan00-ticketing/common"

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  subject: ExpirationCompletedEvent["subject"] = Subjects.ExpirationCompleted
}