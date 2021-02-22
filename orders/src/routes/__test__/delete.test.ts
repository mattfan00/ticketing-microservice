import request from "supertest"
import app from "../../app"
import mongoose from "mongoose"

import Ticket from "../../models/ticket"
import Order, { OrderStatus } from "../../models/order"
import { natsWrapper } from "../../nats-wrapper"

const route = "/api/orders"

it("returns 401 if the user is not authenticated", async () => {
  await request(app)
    .delete(`${route}/${mongoose.Types.ObjectId().toHexString()}`)
    .send({})
    .expect(401)
})

it("returns 404 if the order is not found", async () => {
  const { cookie } = global.register()
  await request(app)
    .delete(`${route}/${mongoose.Types.ObjectId().toHexString()}`)
    .set("Cookie", cookie)
    .send({})
    .expect(404)
})

it("returns 401 if the order does not belong to the user logged in", async () => {
  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10
  })

  const newOrder = await Order.create({
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: newTicket.id
  })

  const { cookie } = global.register()
  await request(app)
    .delete(`${route}/${newOrder.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(401)
})

it("successfully cancels the order", async () => {
  const { currentUser, cookie } = global.register()

  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10
  })

  const newOrder = await Order.create({
    userId: currentUser.id,
    status: OrderStatus.Created,
    ticket: newTicket.id
  })

  await request(app)
    .delete(`${route}/${newOrder.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(200)

  const cancelledOrder = await Order.findById(newOrder.id)

  expect(cancelledOrder!.status).toBe(OrderStatus.Cancelled)
})

it("emits an order cancelled event", async () => {
  const { currentUser, cookie } = global.register()

  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10
  })

  const newOrder = await Order.create({
    userId: currentUser.id,
    status: OrderStatus.Created,
    ticket: newTicket.id
  })

  await request(app)
    .delete(`${route}/${newOrder.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
