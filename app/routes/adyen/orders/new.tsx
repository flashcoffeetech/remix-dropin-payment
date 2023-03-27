import { redirect } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { db } from '~/utils/db.server';

export const action = async ({ request }: any) => {
  const form = await request.formData();

  const name = form.get('name');
  const amount = form.get('amount');

  const fields = { name, amount };

  const order = await db.order.create({ data: fields });

  return redirect(`/adyen/orders/${order.id}`);
};

const NewOrder = () => {
  return (
    <>
      <div className="page-header">
        <h1>New Order</h1>
        <Link to={{ pathname: '/adyen//orders' }} className="btn-reverse">
          back
        </Link>
      </div>
      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" />
          </div>
          <div className="form-control">
            <label htmlFor="amount">amount</label>
            <input type="number" name="amount" id="amount" />
          </div>
          <button type="submit" className="btn btn-submit">
            Checkout
          </button>
        </form>
      </div>
    </>
  );
};

export default NewOrder;
