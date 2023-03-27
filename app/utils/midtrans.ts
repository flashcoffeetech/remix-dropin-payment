import axios from 'axios';

const getTransactionToken = async (order: any) => {
	const response = await axios.post(
		'https://app.sandbox.midtrans.com/snap/v1/transactions',
		{
			transaction_details: {
				order_id: order.id,
				gross_amount: order.amount,
			},
			credit_card: {
				secure: true,
			},
			customer_details: {
				first_name: 'budi',
				last_name: 'pratama',
				email: 'budi.pra@example.com',
				phone: '08111222333',
			},
		},
		{
			headers: {
				'Content-Type': 'application/json',
			},
			auth: {
				username: process.env.MIDTRANS_SERVER_KEY || '',
				password: '',
			},
		},
	);

	return response;
};

export const Midtrans = {
	getTransactionToken,
};
