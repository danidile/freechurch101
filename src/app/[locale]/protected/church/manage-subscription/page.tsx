"use client"
import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Calendar,
  Users,
  CreditCard,
  Download,
  AlertTriangle,
  X,
  CheckCircle,
} from "lucide-react";

// --- MOCK DATA & TYPES --- //
// In a real application, you would fetch this data from your backend.

type Plan = {
  name: string;
  price: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
  maxSeats: number;
  features: string[];
};

type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing";

type Subscription = {
  id: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  trialEnd: string | null;
  plan: Plan;
  seatsUsed: number;
};

type PaymentMethod = {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
};

type Invoice = {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: "paid" | "open" | "failed";
  url: string;
};

const mockSubscription: Subscription = {
  id: "sub_1P9XYZabcdefghijkl",
  status: "active",
  currentPeriodEnd: "2025-09-15T00:00:00.000Z",
  trialEnd: null,
  plan: {
    name: "Growth Plan",
    price: 79,
    currency: "USD",
    billingCycle: "monthly",
    maxSeats: 50,
    features: [
      "Sermon Library",
      "Event Management",
      "Member Directory",
      "Donation Tracking",
      "Email Campaigns",
    ],
  },
  seatsUsed: 32,
};

const mockPaymentMethod: PaymentMethod = {
  brand: "Visa",
  last4: "4242",
  expMonth: 12,
  expYear: 2028,
};

const mockInvoices: Invoice[] = [
  {
    id: "in_1P8ABCdefghijklmno",
    date: "2025-08-15",
    amount: 79,
    currency: "USD",
    status: "paid",
    url: "#",
  },
  {
    id: "in_1P7DEFghijklmnopqrst",
    date: "2025-07-15",
    amount: 79,
    currency: "USD",
    status: "paid",
    url: "#",
  },
  {
    id: "in_1P6GHIjklmnopqrstu",
    date: "2025-06-15",
    amount: 79,
    currency: "USD",
    status: "paid",
    url: "#",
  },
  {
    id: "in_1P5JKLmnopqrstuvw",
    date: "2025-05-15",
    amount: 79,
    currency: "USD",
    status: "paid",
    url: "#",
  },
];

// --- HELPER COMPONENTS --- //

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 ${className}`}
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
  <div className="flex items-center mb-4">
    {icon}
    <h3 className="text-lg font-semibold text-gray-800 ml-3">{title}</h3>
  </div>
);

const StatusBadge = ({ status }: { status: SubscriptionStatus }) => {
  const baseClasses = "px-3 py-1 text-sm font-medium rounded-full inline-block";
  switch (status) {
    case "active":
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          Active
        </span>
      );
    case "past_due":
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          Past Due
        </span>
      );
    case "canceled":
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          Canceled
        </span>
      );
    case "trialing":
      return (
        <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
          Trial
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          {status}
        </span>
      );
  }
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// --- MAIN UI COMPONENTS --- //

const SubscriptionDetails = ({
  subscription,
  onCancel,
}: {
  subscription: Subscription;
  onCancel: () => void;
}) => {
  const renewalDate = new Date(
    subscription.currentPeriodEnd
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleManageSubscription = () => {
    // In a real app, this would redirect to your Stripe Customer Portal
    // For example: window.location.href = 'YOUR_STRIPE_PORTAL_LINK';
    alert("Redirecting to Stripe Customer Portal...");
  };

  return (
    <Card>
      <CardHeader
        title="Current Subscription"
        icon={<Briefcase className="w-6 h-6 text-blue-500" />}
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
          <span className="font-semibold text-gray-800">
            ${subscription.plan.price} /{" "}
            {subscription.plan.billingCycle === "monthly" ? "month" : "year"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Renews on</span>
          <span className="font-semibold text-gray-800">{renewalDate}</span>
        </div>
      </div>
      {subscription.status !== "canceled" && (
        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleManageSubscription}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Manage Subscription
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-transparent text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-red-50 transition duration-200 border border-red-200"
          >
            Cancel Subscription
          </button>
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
      <CardHeader
        title="Plan Usage"
        icon={<Users className="w-6 h-6 text-blue-500" />}
      />
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-gray-800 font-semibold">Team Members</span>
          <span className="text-sm text-gray-500">
            {subscription.seatsUsed} of {subscription.plan.maxSeats} used
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

const PaymentMethodDetails = ({
  paymentMethod,
}: {
  paymentMethod: PaymentMethod;
}) => {
  const handleUpdatePayment = () => {
    // Redirect to Stripe Customer Portal to update payment method
    alert("Redirecting to Stripe to update payment method...");
  };

  return (
    <Card>
      <CardHeader
        title="Payment Method"
        icon={<CreditCard className="w-6 h-6 text-blue-500" />}
      />
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <img
            src={`https://placehold.co/40x26/FFFFFF/000000?text=${paymentMethod.brand}`}
            alt={paymentMethod.brand}
            className="h-6 mr-4 rounded-sm"
          />
          <div>
            <p className="font-semibold text-gray-800">
              {paymentMethod.brand} ending in {paymentMethod.last4}
            </p>
            <p className="text-sm text-gray-500">
              Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
            </p>
          </div>
        </div>
        <button
          onClick={handleUpdatePayment}
          className="text-blue-600 font-semibold text-sm hover:underline"
        >
          Update
        </button>
      </div>
    </Card>
  );
};

const InvoiceHistory = ({ invoices }: { invoices: Invoice[] }) => (
  <Card className="col-span-1 lg:col-span-2">
    <CardHeader
      title="Invoice History"
      icon={<Calendar className="w-6 h-6 text-blue-500" />}
    />
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
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
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Download</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <a
                      href={invoice.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" /> Invoice
                    </a>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 rounded-full p-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Cancel Subscription
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to cancel? Your access to the Growth Plan
          features will be removed at the end of your current billing period.
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Yes, Cancel Subscription
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Keep My Plan
          </button>
        </div>
      </div>
    </div>
  );
};

const CanceledSubscriptionView = ({
  onReactivate,
}: {
  onReactivate: () => void;
}) => (
  <Card className="text-center">
    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      Subscription Canceled
    </h3>
    <p className="text-gray-600 mb-6">
      Your subscription has been successfully canceled. You can reactivate it
      anytime.
    </p>
    <button
      onClick={onReactivate}
      className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
    >
      Reactivate Subscription
    </button>
  </Card>
);

// --- MAIN APP COMPONENT --- //

export default function App() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
        setSubscription(mockSubscription);
        setPaymentMethod(mockPaymentMethod);
        setInvoices(mockInvoices);
      } catch (e) {
        setError("Failed to load subscription data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirmCancel = () => {
    if (subscription) {
      // In a real app, you would make an API call to your backend to cancel the subscription
      console.log("Canceling subscription:", subscription.id);
      setSubscription({ ...subscription, status: "canceled" });
      setIsCancelModalOpen(false);
    }
  };

  const handleReactivate = () => {
    if (subscription) {
      // API call to reactivate
      console.log("Reactivating subscription:", subscription.id);
      setSubscription({ ...subscription, status: "active" });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <Card className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            An Error Occurred
          </h3>
          <p className="text-gray-600">{error}</p>
        </Card>
      </div>
    );
  }

  if (!subscription || !paymentMethod) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <p>No subscription data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Subscription Dashboard
          </h1>
          <p className="mt-1 text-lg text-gray-600">
            Manage your billing and subscription details.
          </p>
        </div>

        {subscription.status === "canceled" ? (
          <CanceledSubscriptionView onReactivate={handleReactivate} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 flex flex-col gap-8">
              <SubscriptionDetails
                subscription={subscription}
                onCancel={() => setIsCancelModalOpen(true)}
              />
              <PlanUsage subscription={subscription} />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-8">
              <PaymentMethodDetails paymentMethod={paymentMethod} />
              <InvoiceHistory invoices={invoices} />
            </div>
          </div>
        )}
      </main>
      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
