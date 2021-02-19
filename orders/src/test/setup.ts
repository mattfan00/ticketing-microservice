import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

declare global {
  namespace NodeJS {
    interface Global {
      register(): {
        currentUser: {
          id: string,
          email: string
        },
        cookie: string[]
      }
    }
  }
}

// If anything tries to import this file, redirect it to the mocked file
jest.mock("../nats-wrapper")

let mongo: any
// Before all tests startup, set up temporary mongo server
beforeAll(async () => {
  process.env.JWT_KEY = "fdjklafdfa"

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

// Before each test starts, delete all the data in mongo
beforeEach(async () => {
  jest.clearAllMocks()

  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
})

global.register = () => {
  // Build a JWT payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com"
  }

  // Create the JWT
  const newJwt = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session Object
  const session = { jwt: newJwt }

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64")

  // return a string thats the cookie with the encoded data
  return {
    currentUser: payload,
    cookie: [`express:sess=${base64}`]
  }
}