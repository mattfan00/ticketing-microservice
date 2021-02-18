import { Message, Stan } from "node-nats-streaming"
import { Subjects } from "./subjects"

interface Event {
  subject: Subjects,
  data: any
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject']
  abstract queueGroupName: string
  abstract onMessage(data: T['data'], msg: Message): void
  protected ackWait = 5 * 1000

  constructor(private client: Stan) {
    this.client = client
  }

  subscriptionOptions() {
    return this.client.subscriptionOptions()
      // subscribers have to confirm with the event bus that they received the event
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      // on first start up, receive all of the events that have been sent in history
      .setDeliverAllAvailable()
      // if the service fails, then only retrieve events that service didn't record
      // behind the scenes, NAT will mark events that have been processed under a DurableName
      .setDurableName(this.queueGroupName)
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    )

    subscription.on("message", (msg: Message) => {
      console.log(`Message received #${msg.getSequence()}: ${this.subject} / ${this.queueGroupName}`)

      const parsedData = this.parseMessage(msg)
      this.onMessage(parsedData, msg)
    })
  }

  parseMessage(msg: Message) {
    const data = msg.getData()
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"))
  }
}
