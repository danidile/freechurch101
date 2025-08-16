"use server";

import Stripe from "stripe";

const cancelSubscriptionAtEnd = async (subId: string) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  try {
    const subscription = await stripe.subscriptions.update(subId, {
      cancel_at_period_end: true,
    });

    // Convert Stripe object into plain JSON
    return {
      success: true,
      subscription: JSON.parse(JSON.stringify(subscription)),
    };
  } catch (error: any) {
    console.error("Error canceling subscription:", error);

    return {
      success: false,
      error: error.message || "Failed to cancel subscription",
    };
  }
};

export default cancelSubscriptionAtEnd;
