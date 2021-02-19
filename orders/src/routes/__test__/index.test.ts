import request from "supertest"
import app from "../../app"
import mongoose from "mongoose"

import Ticket from "../../models/ticket"
import Order, { OrderStatus } from "../../models/order"

const route = "/api/orders"

it("return 401 if the user is not authenticated", async () => {
  await request(app)
    .post(route)
    .send({})
    .expect(401)
})

it("successfully returns the orders for a particular user", async () => {
  // Create 3 tickets
  const newTickets = await Ticket.create([
    { title: "ticket 1", price: 10 },
    { title: "ticket 2", price: 10 },
    { title: "ticket 3", price: 10 },
  ])

  // Create one order as user #1
  await Order.create({
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Complete,
    ticket: newTickets[0].id
  })

  // Create two orders as user #2
  const { currentUser, cookie } = global.register()
  const orderOne = await Order.create({
    userId: currentUser.id,
    status: OrderStatus.Complete,
    ticket: newTickets[1].id
  })

  const orderTwo = await Order.create({
    userId: currentUser.id,
    status: OrderStatus.Complete,
    ticket: newTickets[2].id
  })

  // Get the orders for user #2
  const response = await request(app)
    .get(route)
    .set("Cookie", cookie)
    .send({})
    .expect(200)

  expect(response.body.length).toBe(2)
  expect(response.body[0].id).toBe(orderOne.id)
  expect(response.body[1].id).toBe(orderTwo.id)
})
