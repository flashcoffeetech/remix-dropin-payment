import AdyenCheckout from '@adyen/adyen-web';
import { Link, useLoaderData } from '@remix-run/react';
import * as React from 'react';
import { db } from '~/utils/db.server';
import { setupAdyen } from '~/utils/setupAdyen';

export const loader = async ({ params }: any) => {
  let order = await db.order.findUniqueOrThrow({
    where: { id: params.orderId },
  });

  const sessionRequest = {
    amount: {
      currency: 'HKD',
      value: parseFloat(order.amount.toString()),
    },
    merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT || 'FlashCoffeeHKTest',
    reference: `testforwebapp-${order.id}`,
    returnUrl: `http:\\localhost:3000/orders/${order.id}`,
  }

  const adyen = setupAdyen();
  const sessions = await adyen.checkout.sessions(sessionRequest);

  order = await db.order.update({
    where: {
      id: order.id,
    },
    data: {
      sessionRequest: JSON.stringify(sessionRequest),
    },
  });

  const configuration = {
    environment: process.env.ADYEN_ENVIRONMENT,
    clientKey: process.env.ADYEN_CLIENT_KEY,
  };

  return { order, configuration, sessions };
};

const OrderDetail = () => {
  const { order, configuration, sessions } = useLoaderData();
  const paymentContainer = React.useRef(null);

  React.useEffect(() => {
    const startInitPayment = async () => {
      try {
        const adyenConfiguration = {
          ...configuration,
          analytics: {
            enabled: false,
          },
          session: {
            id: sessions.id,
            sessionData: sessions.sessionData,
          },
          onPaymentCompleted: (result: any, component: any) => {
            console.info(result, component);
          },
          onError: (error: any, component: any) => {
            console.error(error.name, error.message, error.stack, component);
          },
          paymentMethodsConfiguration: {
            card: {
              hasHolderName: true,
              holderNameRequired: true,
              billingAddressRequired: false,
              name: 'Credit or debit card',
            },
          },
        };
        const checkout = await AdyenCheckout(adyenConfiguration);
        checkout.create('dropin').mount(paymentContainer.current);
      } catch (error) {
        console.error(error);
      }
    };
    startInitPayment();
  }, [order.id, configuration, sessions]);

  return (
    <>
      <div className="page-header">
        <h1>Checkout</h1>
        <Link to={{ pathname: '/orders' }} className="btn-reverse">
          back
        </Link>
      </div>
      <div className="page-content">
        <ul className="posts-list">
          <li key={order.id}>
            <h3>
              {order.name} - {order.amount}
            </h3>
          </li>
        </ul>
        <div
          ref={paymentContainer}
          style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: 720,
            minHeight: 480,
            backgroundColor: '#dedede',
            marginTop: 10,
            marginBottom: 10,
            padding: 10,
          }}
        ></div>
      </div>
    </>
  );
};

export default OrderDetail;
