import express from "express"

import { currentUser } from "@mattfan00-ticketing/common"

const router = express.Router()

router.get("/api/users/current", currentUser, (req, res) => {
  res.json({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }