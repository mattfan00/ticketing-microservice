import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import request from "supertest"
import app from "../app"

declare global {
  namespace NodeJS {
    interface Global {
      register(): Promise<string[]>
    }
  }
}

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
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
})

global.register = async () => {
  const email = "test@test.com"
  const password = "password"

  const response = await request(app)
    .post("/api/users/register")
    .send({
      email, password
    })
    .expect(200)

  const cookie = response.get("Set-Cookie")
  return cookie
}