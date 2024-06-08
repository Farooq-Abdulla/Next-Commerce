'use server'

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function CreateOrder(paymentSuccessObject:any) {
  const cookieStore= cookies()
    try {
        const {
            id: paymentId,
            amount,
            billing_details: {
              name: billingName,
              email: billingEmail,
              address: {
                line1: billingAddress,
                city: billingCity,
                state: billingState,
                postal_code: billingZip,
                country: billingCountry,
              },
            },
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
            metadata: { cartId },
            payment_method: paymentMethod,
            receipt_url: receiptUrl,
            status,
            receipt_email: receiptEmail,
          } = paymentSuccessObject;
        
          const order = await prisma.order.create({
            data: {
              paymentId,
              amount,
              billingName,
              billingEmail,
              billingAddress,
              billingCity,
              billingState,
              billingZip,
              billingCountry,
              shippingName,
              shippingAddress,
              shippingCity,
              shippingState,
              shippingZip,
              shippingCountry,
              paymentMethod,
              receiptUrl,
              status,
              receiptEmail,
              cart: {
                connect: { id: cartId },
              },
            },
          });
        cookieStore.set('orderid', order.id)
          return order;
    } catch (error) {
        console.log("Error while Creating Order", error);
        return
    }
    
}