/// <reference types="node" />

import nats from "node-nats-streaming"
import { randomBytes } from "crypto"

console.clear()

const sc = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222"
})

sc.on("connect", () => {
  console.log("publisher connected to NATS")

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20
  })

  sc.publish("ticket:created", data, () => {
    console.log("event published")
  })
})