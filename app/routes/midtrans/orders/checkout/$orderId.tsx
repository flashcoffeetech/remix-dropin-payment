import * as React from 'react';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { Midtrans } from '../../../../utils/midtrans';

export const loader = async ({ params }: any) => {
	let order = await db.order.findUniqueOrThrow({
		where: { id: params.orderId },
	});

	const response = await Midtrans.getTransactionToken(order);

	return {
		data: response.data,
	};
};

const OrderDetail = () => {
	const { data } = useLoaderData();

	const pay = () => {
		window.snap.pay(data.token, {
			onSuccess: function (result) {
				/* You may add your own implementation here */
				alert('payment success!');
				console.log(result);
			},
			onPending: function (result) {
				/* You may add your own implementation here */
				alert('wating your payment!');
				console.log(result);
			},
			onError: function (result) {
				/* You may add your own implementation here */
				alert('payment failed!');
				console.log(result);
			},
			onClose: function () {
				/* You may add your own implementation here */
				alert('you closed the popup without finishing the payment');
			},
		});
	};

	React.useEffect(() => {
		pay();
	}, []);

	return (
		<>
			<div className="page-header">
				<h1>Checkout</h1>
				<Link to={{ pathname: '/midtrans/orders' }} className="btn-reverse">
					back
				</Link>
			</div>
			<div className="page-content">
				<pre>{JSON.stringify(data)}</pre>
			</div>
			<div className="page-footer">
				<button className="btn btn-delete" onClick={pay}>
					Pay
				</button>
			</div>
		</>
	);
};

export default OrderDetail;
