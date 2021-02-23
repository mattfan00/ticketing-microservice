import Ticket from "../ticket"

it("implements optimistic concurrency control", async () => {
  // Create an instance of a ticket
  const newTicket = await Ticket.create({
    title: "my ticket",
    price: 10,
    userId: "123"
  })

  // Fetch the ticket tiwce
  const firstFetch = await Ticket.findById(newTicket.id)
  const secondFetch = await Ticket.findById(newTicket.id)

  // Make two separate changes to the tickets we fetched
  firstFetch!.title = "my first change"
  secondFetch!.title = "my second change"

  // Save the first fetched ticket
  await firstFetch!.save()

  // Save the second fetched ticket and expect an error
  try {
    await secondFetch!.save()
  } catch(err) {
    expect(err.name).toBe("VersionError")
  }
})

it("increments the version number on multiple saves", async() => {
  const newTicket = await Ticket.create({
    title: "new ticket",
    price: 10,
    userId: "123"
  })

  expect(newTicket.version).toBe(0)

  await newTicket.save()

  expect(newTicket.version).toBe(1)
})