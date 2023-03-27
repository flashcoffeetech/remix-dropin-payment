import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';

export const loader = async () => {
  const data = {
    orders: await db.order.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    }),
  };

  return data;
};

const OrderList = () => {
  const { orders } = useLoaderData();

  return (
    <>
      <div className="page-header">
        <h1>Order List</h1>
        <Link to={{ pathname: '/adyen/orders/new' }} className="btn">
          new
        </Link>
      </div>
      <ul className="posts-list">
        {orders.map((order: any) => (
          <li key={order.id}>
            <Link to={{ pathname: `${order.id}` }}>
              <h3>
                {order.name} - {order.amount}
              </h3>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default OrderList;
