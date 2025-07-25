// // app/api/stripe/webhook/route.ts
// import { createClient } from "@/utils/supabase/server";
// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-06-30.basil",
// });

// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// export async function POST(req: NextRequest) {
//   const supabase = await createClient();

//   const buf = await req.arrayBuffer();
//   const rawBody = Buffer.from(buf);

//   const sig = req.headers.get("stripe-signature") as string;
//   console.log("Stripe signature header:", sig);
//   console.log("Raw body length:", rawBody.length);
//   console.log("Raw body preview:", rawBody.subarray(0, 100).toString());

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
//   } catch (err: any) {
//     console.error("❌ Webhook verification failed:", err.message);
//     return new NextResponse("Webhook Error", { status: 400 });
//   }

//   console.log("🔔 Stripe Event Received:", event.type);

//   // Helpers
//   const getCurrentPeriodEnd = (timestamp: number) =>
//     new Date(timestamp * 1000).toISOString();

//   try {
//     switch (event.type) {
//       case "checkout.session.completed": {
//         const session = event.data.object as Stripe.Checkout.Session;

//         const subscriptionId = session.subscription as string;
//         const customerId = session.customer as string;
//         const userId = session.metadata?.user_id ?? null;
//         const churchId = session.metadata?.church ?? null;

//         const subscription =
//           await stripe.subscriptions.retrieve(subscriptionId);
//         const currentPeriodEnd = getCurrentPeriodEnd(
//           subscription.items.data[0].current_period_end
//         );

//         const { error } = await supabase.from("subscriptions").insert({
//           stripe_customer_id: customerId,
//           stripe_subscription_id: subscriptionId,
//           profile: userId,
//           status: subscription.status,
//           current_period_end: currentPeriodEnd,
//           church: churchId,
//         });

//         if (error) throw new Error(`Supabase insert error: ${error.message}`);
//         return NextResponse.json({ received: true });
//       }

//       case "customer.subscription.updated": {
//         const subscription = event.data.object as Stripe.Subscription;

//         const { error } = await supabase
//           .from("subscriptions")
//           .update({
//             status: subscription.status,
//             stripe_price_id: subscription.items.data[0].price.id,
//             current_period_end: getCurrentPeriodEnd(
//               subscription.items.data[0].current_period_end
//             ),
//           })
//           .eq("stripe_subscription_id", subscription.id);

//         if (error) throw new Error(`Supabase update error: ${error.message}`);
//         return NextResponse.json({ received: true });
//       }

//       case "customer.subscription.deleted": {
//         const subscription = event.data.object as Stripe.Subscription;

//         const { error } = await supabase
//           .from("subscriptions")
//           .update({ status: "canceled" })
//           .eq("stripe_subscription_id", subscription.id);

//         if (error) throw new Error(`Supabase cancel error: ${error.message}`);
//         return NextResponse.json({ received: true });
//       }

//       case "invoice.payment_failed": {
//         const invoice = event.data.object as Stripe.Invoice;
//         const customerId =
//           typeof invoice.customer === "string" ? invoice.customer : undefined;

//         if (!customerId) {
//           console.warn("⚠️ No customer ID found in invoice.");
//           return NextResponse.json({ received: true });
//         }

//         const { error } = await supabase
//           .from("subscriptions")
//           .update({ status: "past_due" })
//           .eq("stripe_customer_id", customerId);

//         if (error)
//           throw new Error(`Supabase past_due update error: ${error.message}`);
//         return NextResponse.json({ received: true });
//       }

//       case "invoice.payment_succeeded":
//       case "invoice.paid": {
//         const invoice = event.data.object as Stripe.Invoice;

//         // Skip invoices unrelated to subscriptions
//         const isSubscriptionInvoice =
//           invoice.billing_reason?.startsWith("subscription");

//         if (!isSubscriptionInvoice) {
//           console.log(
//             `ℹ️ Invoice ${invoice.id} not related to a subscription (reason: ${invoice.billing_reason}), skipping.`
//           );
//           return NextResponse.json({ received: true });
//         }

//         const customerId =
//           typeof invoice.customer === "string" ? invoice.customer : undefined;

//         if (!customerId) {
//           console.warn(`⚠️ No customer ID in invoice ${invoice.id}`);
//           return NextResponse.json({ received: true });
//         }

//         // Try getting the subscription ID directly
//         let subscriptionId =
//           typeof invoice.parent.subscription === "string"
//             ? invoice.parent.subscription
//             : undefined;

//         // If not in invoice.subscription, get it from line items
//         if (!subscriptionId && invoice.lines?.data?.length) {
//           subscriptionId =
//             invoice.lines.data[0]?.parent?.subscription_item_details
//               ?.subscription ?? undefined;
//         }

//         if (!subscriptionId) {
//           console.warn(`⚠️ No subscription ID found in invoice ${invoice.id}`);
//           return NextResponse.json({ received: true });
//         }

//         const periodEnd = invoice.lines?.data?.[0]?.period?.end;
//         const currentPeriodEnd = periodEnd
//           ? getCurrentPeriodEnd(periodEnd)
//           : null;

//         if (!currentPeriodEnd) {
//           console.warn(
//             `⚠️ Missing current_period_end for invoice ${invoice.id}`
//           );
//         }

//         const { error } = await supabase
//           .from("subscriptions")
//           .update({
//             status: "active",
//             current_period_end: currentPeriodEnd,
//           })
//           .eq("stripe_subscription_id", subscriptionId);

//         if (error) {
//           throw new Error(
//             `Supabase invoice update error for subscription ${subscriptionId}: ${error.message}`
//           );
//         }

//         console.log(
//           `✅ Updated subscription ${subscriptionId} to active until ${currentPeriodEnd}`
//         );

//         return NextResponse.json({ received: true });
//       }

//       default: {
//         console.log(`ℹ️ Unhandled event type: ${event.type}`);
//         return NextResponse.json({ received: true });
//       }
//     }
//   } catch (err: any) {
//     console.error(
//       `❌ Error handling event ${event.id} (${event.type}):`,
//       err.message
//     );
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  // Leggi il body raw esatto come Buffer
  const buf = Buffer.from(await request.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  console.log(`🔔 Stripe Event Received: ${event.type}`);

  // Qui gestisci gli eventi che ti interessano
  switch (event.type) {
    case "checkout.session.completed":
      // ...
      break;
    // altri eventi...
    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
