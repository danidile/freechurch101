"use client";
import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Settings,
  RefreshCw,
  Download,
  Edit,
  ExternalLink,
  Shield,
  Package,
} from "lucide-react";
import {
  Plan,
  StatusConfig,
  SubscriptionMetadata,
  Subscription,
} from "@/utils/supabase/subscriptionTypes";

// Types based on your Supabase table structure

export default function ManageSubscription({
  subscription,
}: {
  subscription: Subscription | null;
}) {
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [cancellationReason, setCancellationReason] = useState<string>("");

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      price: 29,
      seats: 50,
      features: [
        "Basic Analytics",
        "Email Support",
        "Mobile App",
        "Basic Reports",
      ],
    },
    {
      id: "growth",
      name: "Growth",
      price: 79,
      seats: 150,
      features: [
        "Advanced Analytics",
        "Priority Support",
        "Mobile App",
        "Custom Reports",
        "API Access",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 149,
      seats: 500,
      features: [
        "Premium Analytics",
        "24/7 Support",
        "Mobile App",
        "Advanced Reports",
        "API Access",
        "Custom Integrations",
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, StatusConfig> = {
      active: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        text: "Active",
      },
      trialing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
        text: "Free Trial",
      },
      canceled: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        text: "Canceled",
      },
      incomplete: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertCircle,
        text: "Payment Required",
      },
      past_due: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: AlertCircle,
        text: "Payment Overdue",
      },
    };

    const config = statusConfig[status] || statusConfig.incomplete;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
      >
        <Icon className="w-4 h-4 mr-1.5" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMetadata = (metadata: string | null): SubscriptionMetadata => {
    try {
      return JSON.parse(metadata || "{}");
    } catch {
      return {};
    }
  };

  const getCurrentPlan = (): Plan => {
    const metadata = getMetadata(subscription?.metadata);
    return plans.find((plan) => plan.name === metadata.plan) || plans[0];
  };

  const handleCancelSubscription = async (): Promise<void> => {
    try {
      // Implement Stripe subscription cancellation
      console.log(
        "Canceling subscription:",
        subscription?.stripe_subscription_id,
        "Reason:",
        cancellationReason
      );

      // Update subscription state

      setShowCancelModal(false);
      setCancellationReason("");
    } catch (error) {
      console.error("Error canceling subscription:", error);
    }
  };

  const handleReactivateSubscription = async (): Promise<void> => {
    try {
      // Implement Stripe subscription reactivation
      console.log(
        "Reactivating subscription:",
        subscription?.stripe_subscription_id
      );
    } catch (error) {
      console.error("Error reactivating subscription:", error);
    }
  };

  const handleUpdatePaymentMethod = (): void => {
    // Redirect to Stripe Customer Portal or implement payment method update
    window.open("https://billing.stripe.com/p/login/test_example", "_blank");
  };

  const handleDownloadInvoices = (): void => {
    // Implement invoice download functionality
    console.log(
      "Downloading invoices for customer:",
      subscription?.stripe_customer_id
    );
  };

  const handlePlanChange = (selectedPlan: Plan): void => {
    // Implement plan change logic
    console.log("Changing to plan:", selectedPlan.id);
    setShowUpgradeModal(false);
  };

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Subscription Found
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have an active subscription.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Choose a Plan
          </button>
        </div>
      </div>
    );
  }

  const currentPlan = getCurrentPlan();
  const metadata = getMetadata(subscription?.metadata);
  const daysUntilRenewal = subscription?.current_period_end
    ? Math.ceil(
        (new Date(subscription.current_period_end).getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="min-h-screenp-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestisci Abbonamento Chiesa
          </h1>
          <p className="text-gray-600 mt-2">
            Gestisci l'abbonamento e la fatturazione della tua chiesa
          </p>
        </div>

        {/* Subscription Overview Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {subscription?.profile || "Unknown Church"}
              </h2>
              <div className="flex items-center space-x-4">
                {getStatusBadge(subscription?.status || "incomplete")}
                {subscription?.cancel_at_period_end && (
                  <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    Cancels on {formatDate(subscription.current_period_end)}
                  </span>
                )}
              </div>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                ${currentPlan.price}
              </div>
              <div className="text-sm text-gray-600">al mese</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {currentPlan.seats}
              </div>
              <div className="text-sm text-gray-600">limite membri </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {daysUntilRenewal}
              </div>
              <div className="text-sm text-gray-600">
                giorni fino al rinnovo
              </div>
            </div>
          </div>
        </div>

        {/* Current Plan Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Piano attuale: {currentPlan.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Plan Features</h4>
              <ul className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Billing Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Next billing date:</span>
                  <span className="font-medium">
                    {formatDate(subscription.current_period_end)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subscription started:</span>
                  <span className="font-medium">
                    {formatDate(subscription.created_at)}
                  </span>
                </div>
                {subscription.trial_end && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trial ends:</span>
                    <span className="font-medium text-blue-600">
                      {formatDate(subscription.trial_end)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Package className="w-4 h-4 mr-2" />
            Change Plan
          </button>

          <button
            onClick={handleUpdatePaymentMethod}
            className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Update Payment
          </button>

          <button
            onClick={handleDownloadInvoices}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Invoices
          </button>

          {subscription?.status === "active" &&
          !subscription.cancel_at_period_end ? (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel Subscription
            </button>
          ) : subscription?.cancel_at_period_end ? (
            <button
              onClick={handleReactivateSubscription}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reactivate
            </button>
          ) : null}
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Billing History
          </h3>
          <div className="space-y-3">
            {/* Mock billing history - replace with actual invoice data */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900">
                  July 2025 - {currentPlan.name} Plan
                </div>
                <div className="text-sm text-gray-600">
                  Paid on July 1, 2025
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  ${currentPlan.price}
                </div>
                <div className="text-sm text-green-600">Paid</div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900">
                  June 2025 - {currentPlan.name} Plan
                </div>
                <div className="text-sm text-gray-600">
                  Paid on June 1, 2025
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  ${currentPlan.price}
                </div>
                <div className="text-sm text-green-600">Paid</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Subscription Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Cancel Subscription
                  </h3>
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Your subscription will remain active until{" "}
                  {formatDate(subscription?.current_period_end)}. You'll
                  continue to have access to all features during this time.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for cancellation (optional)
                  </label>
                  <select
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a reason...</option>
                    <option value="too_expensive">Too expensive</option>
                    <option value="not_using">Not using enough</option>
                    <option value="missing_features">Missing features</option>
                    <option value="switching_provider">
                      Switching to another provider
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Keep Subscription
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plan Change Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Choose Your Plan
                  </h3>
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-lg p-6 ${
                        plan.name === currentPlan.name
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {plan.name}
                        </h4>
                        <div className="text-3xl font-bold text-gray-900">
                          ${plan.price}
                        </div>
                        <div className="text-sm text-gray-600">per month</div>
                      </div>
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-2">
                          Up to {plan.seats} members
                        </div>
                        <ul className="space-y-1">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center text-xs text-gray-600"
                            >
                              <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        disabled={plan.name === currentPlan.name}
                        onClick={() => handlePlanChange(plan)}
                        className={`w-full py-2 px-4 rounded-md text-sm font-medium ${
                          plan.name === currentPlan.name
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {plan.name === currentPlan.name
                          ? "Current Plan"
                          : "Select Plan"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
