import express from "express"
import { NotFoundError } from "@mattfan00-ticketing/common"

import Ticket from "../models/ticket"

const router = express.Router()

router.get("/api/tickets/:id", async (req, res) => {
  const foundTicket = await Ticket.findById(req.params.id)

  if (!foundTicket) {
    throw new NotFoundError()
  }

  res.json(foundTicket)
})

export { router as showTicketRouter }