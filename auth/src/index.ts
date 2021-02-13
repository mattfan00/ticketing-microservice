import express from "express"
import "express-async-errors" // so that we can use `throw` in async functions rather than `next()` for errors
import mongoose from "mongoose"
import cookieSession from "cookie-session"

import { currentUserRouter }  from "./routes/current-user"
import { loginRouter }  from "./routes/login"
import { logoutRouter }  from "./routes/logout"
import { registerRouter }  from "./routes/register"

import { errorHandler } from "./middleware/error-handler"
import { NotFoundError } from "./errors/not-found-error"

const app = express()
app.set("trust proxy", true)
app.use(express.json())
app.use(cookieSession({
  signed: false, // disable encryption because JWT is already encrypted
  secure: true, // needs to be https
}))

app.use(currentUserRouter)
app.use(loginRouter)
app.use(logoutRouter)
app.use(registerRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not defined")
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth" , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log("connected to database")
  } catch (err) {
    console.error(err)
  }

  app.listen(3000, () => {
    console.log("auth server started on port 3000")
  })
}

start()
