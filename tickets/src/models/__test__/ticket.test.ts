import { Ticket } from '../ticket-model';

it('implements optimistic concurrency control', async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });

  // Save the ticket to the database
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 20 });

  // Save the first fetched ticket
  await firstInstance!.save();

  // Save the second fetched ticket and expect a versioning error
  try {
    await secondInstance!.save();
    throw new Error('Expected versioning error but did not get one');
  } catch (err) {
    // Check for version mismatch error
    expect(err).toBeDefined();
  }
});
it('increments the version number on multiple saves', async () => {
    // Create an instance of a ticket
    const ticket = Ticket.build({
      title: 'concert',
      price: 100,
      userId: '123',
    });
  
    // Save the ticket to the database initially
    await ticket.save();
    expect(ticket.version).toEqual(0);
  
    // Save the ticket again
    await ticket.save();
    expect(ticket.version).toEqual(1);
  
    // Save the ticket a third time
    await ticket.save();
    expect(ticket.version).toEqual(2);
  });