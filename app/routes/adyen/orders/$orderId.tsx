import { redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { setupAdyen } from '~/utils/setupAdyen';

export const loader = async ({ params, request }: any) => {
  let order = await db.order.findUniqueOrThrow({
    where: { id: params.orderId },
  });

  const url = new URL(request.url);

  const sessionId = url.searchParams.get('sessionId');

  const redirectResult = {
    sessionId,
    redirectResult: url.searchParams.get('redirectResult') || undefined,
    type: url.searchParams.get('type'),
    resultCode: url.searchParams.get('resultCode'),
  };

  if (redirectResult.sessionId) {
    const adyen = setupAdyen();
    const result = await adyen.checkout.paymentsDetails({
      details: redirectResult,
    });
    console.log(result);
    order = await db.order.update({
      where: {
        id: order.id,
      },
      data: {
        redirectResult: JSON.stringify(redirectResult),
        status: result?.resultCode === 'Authorised' ? 'COMPLETED' : 'FAILED',
        paymentDetail: JSON.stringify(result),
      },
    });

    redirect(`orders/${order.id}`);
  }

  return {
    order,
    redirectResult,
  };
};

export const action = async ({ request, params }: any) => {
  const form = await request.formData();

  const method = form.get('_method');

  if (method === 'delete') {
    await db.order.delete({
      where: { id: params.orderId },
    });

    return redirect('/orders');
  }
};

const OrderDetail = () => {
  const { order, redirectResult } = useLoaderData();

  return (
    <>
      <div className="page-header">
        <h1>Order Detail</h1>
        <Link to={{ pathname: '/adyen/orders' }} className="btn-reverse">
          back
        </Link>
      </div>
      <div className="page-content">
        <table className="table">
          <tbody>
            <tr>
              <td>Id</td>
              <td>{order.id}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{order.name}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>{order.amount}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{order.status}</td>
            </tr>
            <tr>
              <td>Created</td>
              <td>{order.createdAt}</td>
            </tr>
            <tr>
              <td>Updated</td>
              <td>{order.updatedAt}</td>
            </tr>
            <tr>
              <td>Session Request</td>
              <td>
                <pre>{order.sessionRequest}</pre>
              </td>
            </tr>
            <tr>
              <td>Redirect Result</td>
              <td>
                <pre>{order.redirectResult}</pre>
              </td>
            </tr>
            <tr>
              <td>Payment Detail</td>
              <td>
                <pre>{order.paymentDetail}</pre>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="page-footer">
        {!redirectResult.sessionId && order.status !== 'COMPLETED' && (
          <Link
            to={{ pathname: `/adyen/orders/checkout/${order.id}` }}
            className="btn btn-delete"
          >
            pay
          </Link>
        )}
        <form method="post">
          <input type="hidden" name="_method" value="delete" />
          <button type="submit" className="btn btn-delete">
            Delete
          </button>
        </form>
      </div>
    </>
  );
};

export default OrderDetail;
