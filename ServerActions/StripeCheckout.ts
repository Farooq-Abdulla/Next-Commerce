"use server";
// interface Props {

//   cartDetails: Cart & { CartItem: (CartItem & { product: Product })[] };
// }
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function StripeCheckout(totalCartCost: number, cartDetails: any) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(totalCartCost.toFixed(2)) * 100,
    currency: "USD",
    metadata: { cartId: cartDetails.id },
  });
  if (paymentIntent.client_secret === null) {
    throw new Error("Stripe failed to create payment intent");
  }
  return paymentIntent.client_secret;
}
