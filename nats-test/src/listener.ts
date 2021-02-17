import nats, { Message, Stan } from "node-nats-streaming"
import { randomBytes } from "crypto"

console.clear()

const sc = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222"
})

sc.on("connect", () => {
  console.log("listener connected to NATS")

  // Normally NATS will let a service run even if it ended just in case it will get back online
  // This is bad because NATS will send the event to this service, even though its dead
  // It will take a couple of seconds for NATS to realize the service isn't coming back, then it resend it to another one that started
  // This makes it so that if a service dies, NATS will not attempt to send events to it anymore
  // Known as a graceful shutdown
  sc.on("close", () => {
    console.log("NATS connection closed")
    process.exit()
  })

  const options = sc.subscriptionOptions()
    // subscribers have to confirm with the event bus that they received the event
    .setManualAckMode(true)
    // on first start up, receive all of the events that have been sent in history
    .setDeliverAllAvailable()
    // if the service fails, then only retrieve events that service didn't record
    // behind the scenes, NAT will mark events that have been processed under a DurableName
    .setDurableName("accounting-service")
  const subscription = sc.subscribe(
    "ticket:created",
    // so that NATS will distribute events among multiple of the same services
    "orders-service-queue-group",
    options
  )

  subscription.on("message", (msg: Message) => {
    const data = msg.getData()

    if (typeof data === "string") {
      console.log(`Event: ${msg.getSequence()}, Data: ${data}`)
    }

    msg.ack()
  })
})

process.on("SIGINT", () => sc.close())
process.on("SIGTERM", () => sc.close())