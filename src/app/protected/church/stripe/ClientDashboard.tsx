"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Calendar,
  Users,
  CreditCard,
  Download,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronRight,
} from "lucide-react";
import {
  Invoice,
  Subscription,
  SubscriptionStatus,
} from "./churchSubscriptionPage";
import Link from "next/link";

export type InvoiceStatus =
  | "paid"
  | "open"
  | "failed"
  | "draft"
  | "uncollectible"
  | "void";

// --- Mock Server Action (Placeholder for the real server action) --- //
const cancelSubscriptionAtEnd = async (subscriptionId: string) => {
  console.log(`Simulating cancellation for subscription: ${subscriptionId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Subscription scheduled for cancellation.",
      });
    }, 500);
  });
};

// --- Main Dashboard Component --- //
function ClientDashboard({
  subscription,
  url,
  invoices,
}: {
  subscription: Subscription | null;
  invoices: Invoice[];
  url: string;
}) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(subscription);

  // --- Handlers for subscription actions --- //
  const handleConfirmCancel = async () => {
    if (currentSubscription) {
      console.log("Canceling subscription:", currentSubscription.id);
      setCurrentSubscription({ ...currentSubscription, status: "canceled" });
      setIsCancelModalOpen(false);
      try {
        const response = await cancelSubscriptionAtEnd(currentSubscription.id);
        console.log("cancelSubscriptionAtEnd response", response);
      } catch (error) {
        console.error("Failed to cancel subscription:", error);
        setCurrentSubscription(subscription);
      }
    }
  };

  const handleReactivate = async () => {
    if (currentSubscription) {
      console.log("Reactivating subscription:", currentSubscription.id);
      setCurrentSubscription({ ...currentSubscription, status: "active" });
    }
  };

  // --- Render No Subscription State --- //
  if (!currentSubscription) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <Card className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Subscription Found
          </h3>
          <p className="text-gray-600">
            We couldn't find any subscription details for your account. If you
            believe this is an error, please contact support.
          </p>
        </Card>
      </div>
    );
  }

  // --- Main Dashboard View --- //
  return (
    <div className="min-h-screen font-sans">
      <main className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Subscription
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your plan, billing, and invoices all in one place.
          </p>
        </header>

        {currentSubscription.status === "canceled" ? (
          <CanceledSubscriptionView onReactivate={handleReactivate} />
        ) : (
          <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8 lg:gap-12 items-start">
            <SubscriptionDetails
              url={url}
              subscription={currentSubscription}
              onCancel={() => setIsCancelModalOpen(true)}
            />
            <PlanUsage subscription={currentSubscription} />

            <InvoiceHistory invoices={invoices} />
          </div>
        )}
      </main>
    </div>
  );
}

export default ClientDashboard;

// --- HELPER & UI COMPONENTS --- //

const Card = ({
  children,
  className = "",
  padding = "p-6 sm:p-8",
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}) => (
  <div
    className={`bg-white border border-gray-200/80 rounded-2xl shadow-sm ${padding} ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => (
  <div className="flex items-center mb-6">
    <div className="flex-shrink-0 bg-blue-500/10 text-blue-600 rounded-lg p-2">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 ml-4">{title}</h3>
  </div>
);

const StatusBadge = ({
  status,
}: {
  status: SubscriptionStatus | InvoiceStatus;
}) => {
  const statusStyles: { [key: string]: string } = {
    active: "bg-green-100 text-green-800",
    trialing: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    past_due: "bg-yellow-100 text-yellow-800",
    unpaid: "bg-yellow-100 text-yellow-800",
    incomplete: "bg-yellow-100 text-yellow-800",
    open: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    uncollectible: "bg-red-100 text-red-800",
    incomplete_expired: "bg-red-100 text-red-800",
    canceled: "bg-gray-100 text-gray-800",
    draft: "bg-gray-100 text-gray-800",
    void: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full inline-block capitalize ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

const SubscriptionDetails = ({
  subscription,
  onCancel,
  url,
}: {
  subscription: Subscription;
  url: string;
  onCancel: () => void;
}) => {
  const renewalDate = new Date(
    subscription.currentPeriodEnd
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const trialEndDate = subscription.trialEnd
    ? new Date(subscription.trialEnd).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const handleManageSubscription = () => {
    alert("Redirecting to Stripe Customer Portal...");
  };

  return (
    <Card>
      <CardHeader
        title="Current Plan"
        icon={<Briefcase className="w-6 h-6" />}
      />
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Plan</span>
          <span className="font-semibold text-gray-800">
            {subscription.plan.name}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Status</span>
          <StatusBadge status={subscription.status} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Price</span>
          <span className="font-semibold text-gray-800 capitalize">
            ${subscription.plan.price} /{" "}
            {subscription.plan.billingCycle.slice(0, -2)}
          </span>
        </div>
        {subscription.status === "trialing" && trialEndDate && (
          <div className="flex justify-between items-center text-blue-700 bg-blue-50 p-3 rounded-lg">
            <span className="font-semibold">Trial ends on</span>
            <span className="font-semibold">{trialEndDate}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">
            {subscription.status === "trialing"
              ? "Your plan will start on"
              : "Renews on"}
          </span>
          <span className="font-semibold text-gray-800">{renewalDate}</span>
        </div>
      </div>
      {subscription.status !== "canceled" && (
        <div className="mt-8 pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row-reverse gap-3">
          <Link
            href={url}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
          >
            Gestisci Iscrizione
          </Link>
        </div>
      )}
    </Card>
  );
};

const PlanUsage = ({ subscription }: { subscription: Subscription }) => {
  const usagePercentage =
    (subscription.seatsUsed / subscription.plan.maxSeats) * 100;

  return (
    <Card>
      <CardHeader title="Plan Usage" icon={<Users className="w-6 h-6" />} />
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-gray-800 font-semibold">Team Members</span>
          <span className="text-sm text-gray-500">
            {subscription.seatsUsed} of {subscription.plan.maxSeats}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

const InvoiceHistory = ({ invoices }: { invoices: Invoice[] }) => (
  <Card padding="p-0 sm:p-0">
    <div className="p-6 sm:p-8">
      <CardHeader
        title="Invoice History"
        icon={<Calendar className="w-6 h-6" />}
      />
    </div>
    <div className="flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-6 sm:pl-8 pr-3 text-left text-sm font-semibold text-gray-900"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-6 sm:pr-8">
                  <span className="sr-only">Download</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/80 bg-white">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="whitespace-nowrap py-4 pl-6 sm:pl-8 pr-3 text-sm text-gray-600">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-6 sm:pr-8 text-right text-sm font-medium">
                    {invoice.url && (
                      <a
                        href={invoice.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center group"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Fattura
                        <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Card>
);

const CancelSubscriptionModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full m-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <div className="bg-red-100 rounded-full p-2.5">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-bold text-gray-900">
            Cancel Subscription
          </h2>
          <p className="text-gray-600 mt-2">
            This will cancel your plan at the end of your current billing
            period. You can reactivate it anytime before then.
          </p>
        </div>
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-200 text-gray-800 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Keep Plan
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const CanceledSubscriptionView = ({
  onReactivate,
}: {
  onReactivate: () => void;
}) => (
  <Card className="text-center max-w-2xl mx-auto">
    <div className="bg-green-100 rounded-full p-3 inline-block">
      <CheckCircle className="w-10 h-10 text-green-600" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
      Subscription Canceled
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      Your plan has been canceled and will not renew. You can still access all
      features until the end of your current billing period.
    </p>
    <button
      onClick={onReactivate}
      className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
    >
      Reactivate Subscription
    </button>
  </Card>
);
