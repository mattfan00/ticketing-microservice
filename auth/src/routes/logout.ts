import express from "express"

const router = express.Router()

router.post("/api/users/logout", (req, res) => {
  req.session = null
  res.json({})
})

export { router as logoutRouter}