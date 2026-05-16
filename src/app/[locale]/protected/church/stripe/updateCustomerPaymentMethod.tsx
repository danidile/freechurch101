import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const updateCustomerPaymentMethod = async (
  customerId: string,
  paymentMethodId: string
) => {
  // Attach the payment method to the customer
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  // Set it as the default payment method for invoices and subscriptions
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  console.log("Payment method updated for customer:", customerId);
};
export default updateCustomerPaymentMethod;
