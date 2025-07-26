"use client";
import { useUserStore } from "@/store/useUserStore";
import ManageSubscription from "./ManageSubscription";
import { getSubscriptionByChurchId } from "@/hooks/GET/getSubscriptionByChurchId";
import { useEffect, useState } from "react";
import { Subscription } from "@/utils/supabase/subscriptionTypes";

export default function Page() {
    const { userData, loading } = useUserStore();
    const [subscription, setSubscription] = useState(null);
    useEffect(() => {
      const fetchSubscription = async () => {
        const fetchedSubscription = await getSubscriptionByChurchId(
          userData.church_id
        );
        setSubscription(fetchedSubscription);
        console.log("Fetched subscription:", fetchedSubscription);
      };
      fetchSubscription();
    }, [userData.loggedIn, loading]);
  const mockSubscription: Subscription = {
    id: 1,
    stripe_subscription_id: "sub_1234567890",
    stripe_customer_id: "cus_abcdef123",
    stripe_price_id: "price_starter_monthly",
    status: "active",
    current_period_end: "2025-08-25T00:00:00Z",
    cancel_at_period_end: false,
    cancel_at: null,
    canceled_at: null,
    trial_start: null,
    trial_end: null,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2025-07-20T00:00:00Z",
    profile: "Grace Community Church",
    metadata: JSON.stringify({
      plan: "Starter",
      seats: 50,
      features: ["Basic Analytics", "Email Support", "Mobile App"],
    }),
  };
  return (
    <>
      <ManageSubscription subscription={mockSubscription} />
    </>
  );
}
