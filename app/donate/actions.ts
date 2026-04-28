"use server";

import { stripe } from "../lib/stripe";

type CreatePaymentIntentResult =
  | { clientSecret: string }
  | { error: string };

export async function createPaymentIntent(
  amountCents: number,
  designation: string
): Promise<CreatePaymentIntentResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: "Payment processing is not yet configured. Please contact info@bapscharities.org to donate." };
  }

  if (amountCents < 100) {
    return { error: "Minimum donation is $1.00." };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        designation,
        organization: "BAPS Charities",
        ein: "26-1530694",
      },
      statement_descriptor_suffix: "BAPS CHARITIES",
    });

    if (!paymentIntent.client_secret) {
      return { error: "Failed to initialize payment. Please try again." };
    }

    return { clientSecret: paymentIntent.client_secret };
  } catch (err) {
    console.error("Stripe createPaymentIntent error:", err);
    return { error: "Payment initialization failed. Please try again or contact info@bapscharities.org." };
  }
}
