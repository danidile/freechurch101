export interface Subscription {
  id: number;
  cancel_at: string | null;
  cancel_at_period_end: boolean | null;
  canceled_at: string | null;
  created_at: string;
  current_period_end: string | null;
  metadata: string | null;
  profile: string | null;
  status: string | null;
  stripe_customer_id: string | null;
  stripe_price_id: string | null;
  stripe_subscription_id: string | null;
  trial_end: string | null;
  trial_start: string | null;
  updated_at: string | null;
}

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "canceled"
  | "incomplete"
  | "past_due";

export interface Plan {
  id: string;
  name: string;
  price: number;
  seats: number;
  features: string[];
}

export interface SubscriptionMetadata {
  plan?: string;
  seats?: number;
  features?: string[];
}

export interface StatusConfig {
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}
