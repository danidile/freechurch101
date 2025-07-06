import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});
export default stripeClient;
