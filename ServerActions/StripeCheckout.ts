"use server";
// interface Props {

//   cartDetails: Cart & { CartItem: (CartItem & { product: Product })[] };
// }
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function StripeCheckout(
  totalCartCost: number,
  cartDetailsId: any,
) {
  const amountInCents = Math.round(totalCartCost * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "USD",
    metadata: { cartId: cartDetailsId },
  });
  if (paymentIntent.client_secret === null) {
    throw new Error("Stripe failed to create payment intent");
  }
  return paymentIntent.client_secret;
}
