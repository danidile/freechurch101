import Stripe from "stripe";
import { redirect } from "next/navigation";
import RedirectToCustomer from "./redirectToCustomer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function Page() {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: "cus_SsC76sVRIG6iam",
      return_url: "https://www.churchlab.it",
      locale: "it",
    });

    if (!session.url) {
      throw new Error("Failed to create Stripe portal session");
    } else {
      return <RedirectToCustomer url={session?.url} />;
    }
  } catch (err) {
    console.error("Error creating Stripe portal session:", err);
    return redirect("/error"); // fallback page
  }
}
