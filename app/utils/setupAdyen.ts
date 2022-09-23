import { CheckoutAPI, Client, Config } from '@adyen/api-library';

export const setupAdyen = () => {
  const config = new Config();

  config.apiKey = process.env.ADYEN_API_KEY;
  config.merchantAccount = process.env.ADYEN_MERCHANT_ACCOUNT;

  const client = new Client({ config });

  client.setEnvironment('TEST', '');

  return {
    checkout: new CheckoutAPI(client),
  };
};
