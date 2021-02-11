import express from "express"

const router = express.Router()

router.post("/api/users/login", (req, res) => {
  res.json({
    message: "hey"
  })
})

export { router as loginRouter}