import mongoose from "mongoose"

import app from "./app"

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not defined")
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined")
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log("connected to database")
  } catch (err) {
    console.error(err)
  }

  app.listen(3000, () => {
    console.log("tickets server started on port 3000")
  })
}

start()