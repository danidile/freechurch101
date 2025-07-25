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
  const supabase = await createClient();
  const body = await req.text();
  const sig = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("❌ Webhook verification failed:", err.message);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  console.log("🔔 Stripe Event Received:", event.type);

  // Helpers
  const getCurrentPeriodEnd = (timestamp: number) =>
    new Date(timestamp * 1000).toISOString();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        const userId = session.metadata?.user_id ?? null;
        const churchId = session.metadata?.church ?? null;

        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const currentPeriodEnd = getCurrentPeriodEnd(
          subscription.items.data[0].current_period_end
        );

        const { error } = await supabase.from("subscriptions").insert({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          profile: userId,
          status: subscription.status,
          current_period_end: currentPeriodEnd,
          church: churchId,
        });

        if (error) throw new Error(`Supabase insert error: ${error.message}`);
        return NextResponse.json({ received: true });
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            stripe_price_id: subscription.items.data[0].price.id,
            current_period_end: getCurrentPeriodEnd(
              subscription.items.data[0].current_period_end
            ),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) throw new Error(`Supabase update error: ${error.message}`);
        return NextResponse.json({ received: true });
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id);

        if (error) throw new Error(`Supabase cancel error: ${error.message}`);
        return NextResponse.json({ received: true });
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : undefined;

        if (!subscriptionId) {
          console.warn("⚠️ No subscription ID found in invoice.");
          return NextResponse.json({ received: true });
        }

        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", subscriptionId);

        if (error)
          throw new Error(`Supabase past_due update error: ${error.message}`);
        return NextResponse.json({ received: true });
      }

      case "invoice.payment_succeeded":
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;

        // ✅ Process only invoices related to subscriptions
        const isSubscriptionInvoice =
          invoice.billing_reason?.startsWith("subscription");

        if (!isSubscriptionInvoice) {
          console.log(
            `ℹ️ Invoice ${invoice.id} not related to a subscription (reason: ${invoice.billing_reason}), skipping.`
          );
          return NextResponse.json({ received: true });
        }

        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : undefined;

        if (!subscriptionId) {
          console.warn("⚠️ No subscription ID found in subscription invoice.");
          return NextResponse.json({ received: true });
        }

        const currentPeriodEnd = invoice.lines?.data?.[0]?.period?.end
          ? getCurrentPeriodEnd(invoice.lines.data[0].period.end)
          : null;

        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: "active",
            current_period_end: currentPeriodEnd,
          })
          .eq("stripe_subscription_id", subscriptionId);

        if (error) {
          throw new Error(`Supabase invoice update error: ${error.message}`);
        }

        return NextResponse.json({ received: true });
      }
      default: {
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
        return NextResponse.json({ received: true });
      }
    }
  } catch (err: any) {
    console.error(
      `❌ Error handling event ${event.id} (${event.type}):`,
      err.message
    );
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}



