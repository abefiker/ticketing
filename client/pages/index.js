import Link from 'next/link';
const LandingPage = ({ currentUser, tickets }) => {
  console.log(tickets);
  console.log(currentUser);
  const ticketList = tickets?.length > 0
    ? tickets.map((ticket) => (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
      </tr>
    ))
    : <tr><td colSpan="3">No tickets found</td></tr>;



  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');
  return { tickets: data, currentUser };
};

export default LandingPage;
