import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const startCheckout = async (
  priceId: string,
  userId: string,
  email: string,
  church: string
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ priceId, userId, email, church }),
  });

  const text = await res.text();
  console.log("Raw response:", text);

  try {
    const data = JSON.parse(text);
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: data.id });
  } catch (err) {
    console.error("Failed to parse JSON:", err);
  }
};
export default startCheckout;
