import express, { Request, Response } from "express"
import { body } from "express-validator"
import Ticket from "../models/ticket"
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher"
import { natsWrapper } from "../nats-wrapper"

import {
  NotAuthorizedError,
  NotFoundError,
  BadRequestError,
  requireAuth,
  validateRequest
} from "@mattfan00-ticketing/common"

const router = express.Router()

router.put("/api/tickets/:id", [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")
], validateRequest, requireAuth, async (req: Request, res: Response) => {
  const foundTicket = await Ticket.findById(req.params.id)

  if (!foundTicket) {
    throw new NotFoundError()
  }

  if (foundTicket.userId != req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  if (foundTicket.orderId) {
    throw new BadRequestError("Cannot edit a reserved ticket")
  }

  const { title, price } = req.body
  foundTicket.set({ title, price })
  const updatedTicket = await foundTicket.save()

  await new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: updatedTicket.id,
    title: updatedTicket.title,
    price: updatedTicket.price,
    userId: updatedTicket.userId,
    version: updatedTicket.version
  })


  res.json(updatedTicket)
})

export { router as updateTicketRouter }