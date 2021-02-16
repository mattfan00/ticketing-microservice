import express from "express"
import Ticket from "../models/ticket"

const router = express.Router()

router.get("/api/tickets", async (req, res) => {
  const foundTickets = await Ticket.find({})

  res.json(foundTickets)
})

export { router as indexTicketRouter }