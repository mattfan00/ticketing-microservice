import express from "express"

const router = express.Router()

router.post("/api/users/logout", (req, res) => {
  res.json({
    message: "hey"
  })
})

export { router as logoutRouter}