import express from "express"

const router = express.Router()

router.get("/api/users/current", (req, res) => {
  res.json({
    message: "hey"
  })
})

export { router as currentUserRouter }