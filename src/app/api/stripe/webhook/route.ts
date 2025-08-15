import { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/utils/supabase/server_admin";
import { logEvent } from "@/utils/supabase/log";

export const config = {
  api: {
    bodyParser: false, // <--- disable body parsing for Stripe signature verification
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Helper function to convert Unix timestamp to ISO string
const toISOString = (timestamp: number | null): string | null => {
  return timestamp ? new Date(timestamp * 1000).toISOString() : null;
};

// Helper function to extract metadata from subscription
const extractSubscriptionMetadata = (subscription: Stripe.Subscription) => {
  const planMetadata = subscription.items.data[0]?.price?.metadata || {};

  return {
    plan: planMetadata.plan || "Unknown",
    seats: parseInt(planMetadata.max_members || "0"),
    features: planMetadata.features ? JSON.parse(planMetadata.features) : [],
  };
};

export async function POST(req: Request) {
  const stripeSignature = (await headers()).get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Webhook signature verification failed:", errorMessage);
    await logEvent({
      event: "stripe_webhook_error",
      level: "error",
      meta: {
        message: errorMessage,
      },
    });
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  console.log("✅ Verified Stripe event:", event.type);

  const permittedEvents = [
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "customer.subscription.trial_will_end",
    "invoice.created",
    "invoice.finalized",
    "invoice.payment_succeeded",
    "invoice.payment_failed",
    "invoice.paid",
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
  ];

  if (permittedEvents.includes(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;

          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;
          const userId = session.metadata?.user_id ?? null;
          const churchId = session.metadata?.church ?? null;

          // Get full subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId,
            {
              expand: ["items.data.price"],
            }
          );

          const metadata = extractSubscriptionMetadata(subscription);

          // Insert/Update subscription in database
          const { error: subError } = await supabaseAdmin
            .from("subscriptions")
            .upsert(
              {
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                stripe_price_id: subscription.items.data[0]?.price?.id,
                profile: userId,
                status: subscription.status,
                current_period_end: toISOString(
                  subscription.items.data[0]?.current_period_end
                ),
                church: churchId,
                trial_start: toISOString(subscription.trial_start),
                trial_end: toISOString(subscription.trial_end),
                cancel_at_period_end: subscription.cancel_at_period_end,
                cancel_at: toISOString(subscription.cancel_at),
                canceled_at: toISOString(subscription.canceled_at),
                metadata: JSON.stringify(metadata),
                created_at: toISOString(subscription.created),
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: "stripe_subscription_id",
              }
            );

          if (subError) {
            console.error("❌ Subscription upsert error:", subError);
            throw new Error(`Subscription upsert error: ${subError.message}`);
          }

          // Update church record if church_id is provided
          if (churchId) {
            console.log(
              `Updating church ${churchId} with subscription ${subscriptionId}`
            );
            const { error: churchError } = await supabaseAdmin
              .from("churches")
              .update({
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                subscription_status: subscription.status,
                stripe_price_id: subscription.items.data[0]?.price?.id,
              })
              .eq("id", churchId);

            if (churchError) {
              console.warn("⚠️ Church update error:", churchError);
            } else {
              console.log(
                `✅ Updated church ${churchId} with subscription ${subscriptionId}`
              );
            }
          }

          console.log(
            `✅ Checkout completed for subscription: ${subscriptionId}`
          );
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          const metadata = extractSubscriptionMetadata(subscription);

          // Get church name from existing subscription or customer
          let churchName = null;
          const { data: existingSub } = await supabaseAdmin
            .from("subscriptions")
            .select("profile")
            .eq("stripe_subscription_id", subscription.id)
            .single();

          if (existingSub?.profile) {
            churchName = existingSub.profile;
          } else {
            // Try to get from customer metadata
            // const customer = await stripe.customers.retrieve(
            //   subscription.customer as string
            // );
            // if (customer && !customer.deleted) {
            //   churchName = customer.metadata?.church_name || customer.name;
            // }
          }

          const { error } = await supabaseAdmin.from("subscriptions").upsert(
            {
              stripe_customer_id: subscription.customer as string,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0]?.price?.id,
              profile: churchName,
              status: subscription.status,
              current_period_end: toISOString(
                subscription.items.data[0]?.current_period_end
              ),
              trial_start: toISOString(subscription.trial_start),
              trial_end: toISOString(subscription.trial_end),
              cancel_at_period_end: subscription.cancel_at_period_end,
              cancel_at: toISOString(subscription.cancel_at),
              canceled_at: toISOString(subscription.canceled_at),
              metadata: JSON.stringify(metadata),
              created_at: toISOString(subscription.created),
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "stripe_subscription_id",
            }
          );

          if (error) {
            console.error("❌ Subscription update error:", error);
            throw new Error(`Subscription update error: ${error.message}`);
          }

          console.log(`✅ Subscription ${event.type}: ${subscription.id}`);
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;

          const { error } = await supabaseAdmin
            .from("subscriptions")
            .update({
              status: "canceled",
              canceled_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);

          if (error) {
            console.error("❌ Subscription deletion error:", error);
            throw new Error(`Subscription deletion error: ${error.message}`);
          }

          console.log(`✅ Subscription deleted: ${subscription.id}`);
          break;
        }

        case "invoice.created":
        case "invoice.finalized": {
          const invoice = event.data.object as Stripe.Invoice;

          // Only process subscription-related invoices

          // if (!invoice.subscription) {
          //   console.log(
          //     `ℹ️ Invoice ${invoice.id} not related to subscription, skipping`
          //   );
          //   break;
          // }

          // // Get subscription from database to link invoice
          // const { data: subscription } = await supabase
          //   .from("subscriptions")
          //   .select("id")
          //   .eq("stripe_subscription_id", invoice.subscription as string)
          //   .single();

          // if (!subscription) {
          //   console.warn(`⚠️ No subscription found for invoice ${invoice.id}`);
          //   break;
          // }

          // const { error } = await supabase.from("invoices").upsert(
          //   {
          //     subscription_id: subscription.id,
          //     stripe_invoice_id: invoice.id,
          //     amount_paid: (invoice.amount_paid || 0) / 100, // Convert from cents
          //     amount_due: (invoice.amount_due || 0) / 100,
          //     currency: invoice.currency || "usd",
          //     status: invoice.status || "draft",
          //     invoice_date: toISOString(invoice.created),
          //     due_date: toISOString(invoice.due_date),
          //     paid_at: invoice.status_transitions?.paid_at
          //       ? toISOString(invoice.status_transitions.paid_at)
          //       : null,
          //     hosted_invoice_url: invoice.hosted_invoice_url,
          //     invoice_pdf: invoice.invoice_pdf,
          //     description: invoice.lines?.data?.[0]?.description || null,
          //     created_at: new Date().toISOString(),
          //   },
          //   {
          //     onConflict: "stripe_invoice_id",
          //   }
          // );

          // if (error) {
          //   console.error("❌ Invoice upsert error:", error);
          //   throw new Error(`Invoice upsert error: ${error.message}`);
          // }

          console.log(`✅ Invoice ${event.type}: ${invoice.id}`);
          break;
        }

        case "invoice.payment_succeeded":
        case "invoice.paid": {
          const invoice = event.data.object as Stripe.Invoice;

          // Skip non-subscription invoices
          // if (!invoice.subscription) {
          //   console.log(
          //     `ℹ️ Invoice ${invoice.id} not subscription-related, skipping`
          //   );
          //   break;
          // }

          // // Update subscription status to active
          // const { error: subError } = await supabase
          //   .from("subscriptions")
          //   .update({
          //     status: "active",
          //     updated_at: new Date().toISOString(),
          //   })
          //   .eq("stripe_subscription_id", invoice.subscription as string);

          // if (subError) {
          //   console.error("❌ Subscription status update error:", subError);
          // }

          // // Update invoice record
          // const { data: subscription } = await supabase
          //   .from("subscriptions")
          //   .select("id")
          //   .eq("stripe_subscription_id", invoice.subscription as string)
          //   .single();

          // if (subscription) {
          //   const { error: invError } = await supabase.from("invoices").upsert(
          //     {
          //       subscription_id: subscription.id,
          //       stripe_invoice_id: invoice.id,
          //       amount_paid: (invoice.amount_paid || 0) / 100,
          //       amount_due: (invoice.amount_due || 0) / 100,
          //       currency: invoice.currency || "usd",
          //       status: "paid",
          //       invoice_date: toISOString(invoice.created),
          //       due_date: toISOString(invoice.due_date),
          //       paid_at: toISOString(
          //         invoice.status_transitions?.paid_at || invoice.created
          //       ),
          //       hosted_invoice_url: invoice.hosted_invoice_url,
          //       invoice_pdf: invoice.invoice_pdf,
          //       description: invoice.lines?.data?.[0]?.description || null,
          //       created_at: new Date().toISOString(),
          //     },
          //     {
          //       onConflict: "stripe_invoice_id",
          //     }
          //   );

          //   if (invError) {
          //     console.error("❌ Invoice payment update error:", invError);
          //   }
          // }

          console.log(`✅ Invoice payment succeeded: ${invoice.id}`);
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;

          // if (!invoice.subscription) {
          //   console.log(
          //     `ℹ️ Invoice ${invoice.id} not subscription-related, skipping`
          //   );
          //   break;
          // }

          // Update subscription status to past_due
          // const { error: subError } = await supabase
          //   .from("subscriptions")
          //   .update({
          //     status: "past_due",
          //     updated_at: new Date().toISOString(),
          //   })
          //   .eq("stripe_subscription_id", invoice.subscription as string);

          // if (subError) {
          //   console.error("❌ Subscription past_due update error:", subError);
          // }

          // // Update invoice record
          // const { data: subscription } = await supabase
          //   .from("subscriptions")
          //   .select("id")
          //   .eq("stripe_subscription_id", invoice.subscription as string)
          //   .single();

          // if (subscription) {
          //   const { error: invError } = await supabase.from("invoices").upsert(
          //     {
          //       subscription_id: subscription.id,
          //       stripe_invoice_id: invoice.id,
          //       amount_paid: (invoice.amount_paid || 0) / 100,
          //       amount_due: (invoice.amount_due || 0) / 100,
          //       currency: invoice.currency || "usd",
          //       status: "open", // Failed payment keeps invoice open
          //       invoice_date: toISOString(invoice.created),
          //       due_date: toISOString(invoice.due_date),
          //       paid_at: null,
          //       hosted_invoice_url: invoice.hosted_invoice_url,
          //       invoice_pdf: invoice.invoice_pdf,
          //       description: invoice.lines?.data?.[0]?.description || null,
          //       created_at: new Date().toISOString(),
          //     },
          //     {
          //       onConflict: "stripe_invoice_id",
          //     }
          //   );

          //   if (invError) {
          //     console.error(
          //       "❌ Invoice payment failed update error:",
          //       invError
          //     );
          //   }
          // }

          console.log(`❌ Invoice payment failed: ${invoice.id}`);
          break;
        }

        case "customer.subscription.trial_will_end": {
          const subscription = event.data.object as Stripe.Subscription;

          // Just log this event - you might want to send notifications
          console.log(
            `⏰ Trial ending soon for subscription: ${subscription.id}`
          );

          // Optional: Update any trial-related fields or trigger notifications
          const { error } = await supabaseAdmin
            .from("subscriptions")
            .update({
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);

          if (error) {
            console.error("❌ Trial will end update error:", error);
          }
          break;
        }

        case "payment_intent.succeeded": {
          const intent = event.data.object as Stripe.PaymentIntent;
          console.log(
            `✅ Payment succeeded: ${intent.id} - Status: ${intent.status}`
          );
          break;
        }

        case "payment_intent.payment_failed": {
          const intent = event.data.object as Stripe.PaymentIntent;
          console.log(
            `❌ Payment failed: ${intent.id} - ${intent.last_payment_error?.message}`
          );
          break;
        }

        default: {
          console.log(`ℹ️ Unhandled event type: ${event.type}`);
          break;
        }
      }

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("⚠️ Error handling webhook event:", error);
      return NextResponse.json(
        {
          message: "Webhook handler failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ message: "Event not processed" }, { status: 200 });
}
