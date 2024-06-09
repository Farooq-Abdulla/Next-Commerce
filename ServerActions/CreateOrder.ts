"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function CreateOrder(paymentSuccessObject: any, cartId: string) {
  console.log("In Create Order - Server");
  const cookieStore = cookies();
  try {
    const {
      id: paymentId,
      amount,
      receipt_email: billingEmail,
      shipping: {
        name: shippingName,
        address: {
          line1: shippingAddress,
          city: shippingCity,
          state: shippingState,
          postal_code: shippingZip,
          country: shippingCountry,
        },
      },
      payment_method: paymentMethod,
      status,
      client_secret,
    } = paymentSuccessObject.paymentIntent;

    const order = await prisma.order.create({
      data: {
        paymentId,
        amount,
        billingName: shippingName,
        billingEmail,
        billingAddress: shippingAddress,
        billingCity: shippingCity,
        billingState: shippingState,
        billingZip: shippingZip,
        billingCountry: shippingCountry,
        shippingName,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZip,
        shippingCountry,
        paymentMethod,
        status,
        receiptEmail: billingEmail,
        cart: {
          connect: { id: cartId },
        },
      },
    });
    cookieStore.set("orderId", order.id);
    const Cart = await prisma.cart.update({
      where: { id: cartId },
      data: { isArchived: true },
    });
    cookieStore.delete("anonymousId");
    console.log("cool");
    return order;
  } catch (error) {
    console.log("Error while Creating Order", error);
    return;
  }
}
