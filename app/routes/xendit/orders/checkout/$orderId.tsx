import { redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { Xendit } from '../../../../utils/xendit';

export const loader = async ({ params }: any) => {
	let order = await db.order.findUniqueOrThrow({
		where: { id: params.orderId },
	});

	const response = await Xendit.createInvoice({
		amount: parseInt(order.amount.toFixed()),
		external_id: `testforwebapp-${order.id}`,
		description: `testforwebapp-${order.id}`,
		payer_email: 'tester@flash-coffee.com',
	});

	console.log(response.data);

	return redirect(response.data.invoice_url);
};

const OrderDetail = () => {
	const { data } = useLoaderData();

	return (
		<>
			<div className="page-header">
				<h1>Checkout</h1>
				<Link to={{ pathname: '/xendit/orders' }} className="btn-reverse">
					back
				</Link>
			</div>
			<div className="page-content">
				<pre>{JSON.stringify(data)}</pre>
			</div>
		</>
	);
};

export default OrderDetail;
