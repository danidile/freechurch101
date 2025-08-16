"use server";

import Stripe from "stripe";
import React from "react";
import ClientDashboard from "./ClientDashboard";

// --- Initialize Stripe --- //
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// --- TYPES (shared) --- //
export type Plan = {
  name: string;
  price: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
  maxSeats: number;
  features: string[];
};

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid";

export type Subscription = {
  id: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  trialEnd: string | null;
  plan: Plan;
  seatsUsed: number;
};

export type PaymentMethod = {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
};

export type Invoice = {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: "paid" | "open" | "failed" | "draft" | "uncollectible" | "void";
  url: string | null;
};

// --- SERVER COMPONENT (Default Export) --- //
export default async function ChurchSubscriptionPage({
  customerId,
}: {
  customerId: string;
}) {
  try {
    const [subscriptionsRes, invoicesRes] = await Promise.all([
      stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
        expand: ["data.default_payment_method", "data.items.data.price"],
      }),
      stripe.invoices.list({ customer: customerId, limit: 10 }),
    ]);

    const stripeSubscription =
      subscriptionsRes.data.length > 0 ? subscriptionsRes.data[0] : null;

    let subscription: Subscription | null = null;
    const session = await stripe.billingPortal.sessions.create({
      customer: "cus_SsC76sVRIG6iam",
      return_url: "https://www.churchlab.it",
      locale: "it",
    });
    if (stripeSubscription) {
      const price = stripeSubscription.items.data[0]?.price;

      let product: Stripe.Product | null = null;
      if (price?.product && typeof price.product === "string") {
        product = await stripe.products.retrieve(price.product);
      } else {
        product = price?.product as Stripe.Product;
      }

      subscription = {
        id: stripeSubscription.id,
        status: stripeSubscription.status as SubscriptionStatus,
        currentPeriodEnd: new Date(
          stripeSubscription.items.data[0]?.current_period_end * 1000
        ).toISOString(),
        trialEnd: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000).toISOString()
          : null,
        plan: {
          name: product?.name ?? "Unnamed Plan",
          price: (price?.unit_amount ?? 0) / 100,
          currency: price?.currency ?? "usd",
          billingCycle:
            price?.recurring?.interval === "month" ? "monthly" : "yearly",
          maxSeats: parseInt(product?.metadata.max_members ?? "1"),
          features: product?.metadata.features
            ? JSON.parse(product.metadata.features)
            : [],
        },
        seatsUsed: 32,
      };
    }

    const invoices: Invoice[] = invoicesRes.data.map((inv) => ({
      id: inv.id,
      date: new Date(inv.created * 1000).toISOString(),
      amount: (inv.amount_paid ?? inv.amount_due) / 100,
      currency: inv.currency,
      status: inv.status as Invoice["status"],
      url: inv.hosted_invoice_url,
    }));
    console.log(subscription, "subscription");
    return (
      <ClientDashboard
        url={session.url}
        subscription={subscription}
        invoices={invoices}
      />
    );
  } catch (error) {
    console.error("Error fetching Stripe data:", error);
    return <div>Error loading subscription data.</div>;
  }
}
