// app/api/stripe/webhook/route.ts
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const supabase = createClient();

  const body = await req.text();
  const sig = headers().get("stripe-signature") as string;

  let event: Stripe.Event;
  console.log("Webhook");
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  // ✅ Handle the subscription created or completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;
    const userId = session.metadata?.user_id; // make sure you passed this when creating the session

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log("Webhook: Adding subscription for", {
      userId,
      subscriptionId,
      customerId,
      church: subscription.metadata.church,
    });
    // Insert into Supabase
    const { error } = await supabase.from("subscriptions").insert({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      user_id: userId,
      status: subscription.status,
      current_period_end: subscription.days_until_due,
      church: subscription.metadata.church,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to insert into Supabase" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
