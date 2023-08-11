import Stripe from 'stripe';

export const stripe = new Stripe(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env.STRIPE_SECRET!,
  {
    apiVersion: '2022-11-15',
  }
);
