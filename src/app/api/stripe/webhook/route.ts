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

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  console.log("🔔 Stripe Event:", event.type);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;
      const userId = session.metadata?.user_id;
      const churchId = session.metadata?.church;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const currentPeriodEnd = new Date(
        subscription.items.data[0].current_period_end * 1000
      ).toISOString();
      const { error } = await supabase.from("subscriptions").insert({
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        profile: userId,
        status: subscription.status,
        current_period_end: currentPeriodEnd,
        church: churchId,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json(
          { error: "Failed to insert into Supabase" },
          { status: 500 }
        );
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const subscriptionId = subscription.id;
      const currentPeriodEnd = new Date(
        subscription.items.data[0].current_period_end * 1000
      ).toISOString();
      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: subscription.status,
          stripe_price_id: subscription.items.data[0].price.id,
          current_period_end: currentPeriodEnd,
        })
        .eq("stripe_subscription_id", subscriptionId);

      if (error) {
        console.error("Supabase update error:", error);
        return NextResponse.json(
          { error: "Failed to update subscription" },
          { status: 500 }
        );
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
        })
        .eq("stripe_subscription_id", subscription.id);

      if (error) {
        console.error("Supabase update error:", error);
        return NextResponse.json(
          { error: "Failed to cancel subscription" },
          { status: 500 }
        );
      }
      break;
    }

    case "invoice.payment_failed": {
      // const invoice = event.data.object as Stripe.Invoice;

      // const subscriptionId =
      //   typeof invoice.subscription === "string"
      //     ? invoice.subscription
      //     : invoice.subscription?.id;

      // if (!subscriptionId) {
      //   console.warn("No subscription ID found in invoice. Skipping.");
      //   break;
      // }

      // const { error } = await supabase
      //   .from("subscriptions")
      //   .update({ status: "past_due" })
      //   .eq("stripe_subscription_id", subscriptionId);

      // if (error) {
      //   console.error("Supabase update error:", error);
      //   return NextResponse.json(
      //     { error: "Failed to update subscription" },
      //     { status: 500 }
      //   );
      // }

      break;
    }

    // You can also add invoice.payment_succeeded here if needed

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
