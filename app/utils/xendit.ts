import axios from 'axios';

interface ICreateInvoice {
	external_id: string;
	amount: number;
	payer_email: string;
	description: string;
}

const createInvoice = async (params: ICreateInvoice) => {
	const response = await axios.post(
		'https://api.xendit.co/v2/invoices',
		{
			...params,
			payment_methods: [
				'CREDIT_CARD',
				'BCA',
				'BNI',
				'BSI',
				'BRI',
				'MANDIRI',
				'PERMATA',
				'SAHABAT_SAMPOERNA',
				'ALFAMART',
				'INDOMARET',
				'OVO',
				'DANA',
				'SHOPEEPAY',
				'LINKAJA',
				'DD_BRI',
				'DD_BCA_KLIKPAY',
				'KREDIVO',
				'AKULAKU',
				'UANGME',
				'ATOME',
				'QRIS',
			],
			success_redirect_url: `http:\\localhost:3001/xendit/orders/${params.external_id}`,
			failure_redirect_url: `http:\\localhost:3001/xendit/orders/${params.external_id}`,
		},
		{
			headers: {
				'Content-Type': 'application/json',
			},
			auth: {
				username: process.env.XENDIT_KEY || '',
				password: '',
			},
		},
	);

	return response;
};

export const Xendit = {
	createInvoice,
};
