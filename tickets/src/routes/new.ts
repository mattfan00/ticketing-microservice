import express, { Request, Response } from "express"
import { body } from "express-validator"

import { requireAuth, validateRequest } from "@mattfan00-ticketing/common"

import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher"
import { natsWrapper } from "../nats-wrapper"

import Ticket from "../models/ticket"

const router = express.Router()

router.post("/api/tickets", requireAuth, [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")
], validateRequest, async (req: Request, res: Response) => {
  const { title, price } = req.body

  const newTicket = await Ticket.create({
    title,
    price,
    userId: req.currentUser!.id
  })

  await new TicketCreatedPublisher(natsWrapper.client).publish({
    id: newTicket.id,
    title: newTicket.title,
    price: newTicket.price,
    userId: newTicket.userId
  })

  res.json(newTicket)
})


export { router as createTicketRouter}