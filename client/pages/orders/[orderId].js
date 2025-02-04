import { useEffect, useState } from 'react';
const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState();
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expireAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  return <div>Time left to pay : {timeLeft} seconds</div>;
};
OrderShow.getIntialProps = async (client, context) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/orders/${orderId}`);
  return { order: data };
};
export default OrderShow;
