import axios from 'axios';

interface ICreateInvoice {
	external_id: string;
	amount: number;
	payer_email: string;
	description: string;
	payment_methods?: string[];
  failure_redirect_url?: string;
  success_redirect_url?: string;
}

const createInvoice = async (params: ICreateInvoice) => {
	const response = await axios.post(
		'https://api.xendit.co/v2/invoices',
		params,
		{
			headers: {
				'Content-Type': 'application/json',
			},
      auth: {
        username: 'xnd_development_OomAfOUth+GowsY6LeJOHzLCZtSj84J9kXDn+Rxj/mHW+byhDQVxhg==',
        password: '',
      }
		},
	);

  return response;
};

export const Xendit = {
	createInvoice,
};
