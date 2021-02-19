import request from "supertest"
import app from "../../app"
import mongoose from "mongoose"

import Order, { OrderStatus } from "../../models/order"
import Ticket from "../../models/ticket"

const route = "/api/orders"

it("returns 401 if user is not authenticated", async () => {
  await request(app)
    .get(`${route}/${mongoose.Types.ObjectId().toHexString()}`)
    .send({})
    .expect(401)
})

it("returns 404 if the order is not found", async () => {
  const { cookie } = global.register()
  await request(app)
    .get(`${route}/${mongoose.Types.ObjectId().toHexString()}`)
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
    status: OrderStatus.Complete,
    ticket: newTicket.id
  })

  const { cookie } = global.register()
  await request(app)
    .get(`${route}/${newOrder.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(401)
})

it("successfully returns single order", async () => {
  const { currentUser, cookie } = global.register()

  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10
  })

  const newOrder = await Order.create({
    userId: currentUser.id,
    status: OrderStatus.Complete,
    ticket: newTicket.id
  })

  const response = await request(app)
    .get(`${route}/${newOrder.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(200)

  expect(response.body.id).toBe(newOrder.id)
  expect(response.body.ticket.id).toBe(newTicket.id)
})
