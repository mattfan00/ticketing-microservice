import request from "supertest"
import app from "../../app"
import mongoose from "mongoose"
import Ticket from "../../models/ticket"

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  const { cookie }= global.register()

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: "my ticket",
      price: 10
    })
    .expect(404)
})

it("returns a 401 if the user is not logged in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "my ticket",
      price: 10
    })
    .expect(401)
})

it("returns a 401 if the user does not own the ticket", async () => {
  // This ticket's userId does not correspond with the currentUser.id
  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
  })

  const { cookie } = global.register()

  await request(app)
    .put(`/api/tickets/${newTicket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "my updated ticket",
      price: 100
    })
    .expect(401)
})

it("returns a 400 if the user provides invalid fields", async () => {
  const { currentUser, cookie } = global.register()
  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10,
    userId: currentUser.id
  })

  await request(app)
    .put(`/api/tickets/${newTicket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10
    })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${newTicket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "my updated title",
      price: -10
    })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${newTicket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: -10
    })
    .expect(400)

})

it("updates the ticket if everything is correct", async () => {
  const { currentUser, cookie } = global.register()
  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10,
    userId: currentUser.id
  })

  const updatedTicket = {
    title: "my updated ticket",
    price: 100
  }

  const response = await request(app)
    .put(`/api/tickets/${newTicket.id}`)
    .set("Cookie", cookie)
    .send(updatedTicket)
    .expect(200)

  expect(response.body.id).toEqual(newTicket.id)
  expect(response.body.title).toEqual(updatedTicket.title)
  expect(response.body.price).toEqual(updatedTicket.price)
  expect(response.body.userId).toEqual(newTicket.userId)
})