"use server";

import getServerSession from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function MergeCarts() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const cookieStore = cookies();
  const anonymousCartId = cookieStore.get("anonymousCartId")?.value;

  if (!anonymousCartId) {
    return null;
  }

  const anonymousCart = await prisma.cart.findUnique({
    where: { id: anonymousCartId },
    include: { CartItem: true },
  });

  if (!anonymousCart) {
    return null;
  }

  const userCart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { CartItem: true },
  });

  if (!userCart) {
    // Create a new cart for the user and merge anonymous cart items
    await prisma.cart.create({
      data: {
        userId: user.id,
        CartItem: {
          create: anonymousCart.CartItem.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });
  } else {
    const mergedItems = [...userCart.CartItem];

    for (const item of anonymousCart.CartItem) {
      const existingItem = mergedItems.find(
        (cartItem) => cartItem.productId === item.productId,
      );

      if (existingItem) {
        await prisma.cartItem.update({
          where: {
            cartId_productId: {
              cartId: userCart.id,
              productId: existingItem.productId,
            },
          },
          data: {
            quantity: existingItem.quantity + item.quantity,
          },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }
  }
  await prisma.cartItem.deleteMany({
    where: { cartId: anonymousCart.id },
  });

  await prisma.cart.delete({
    where: { id: anonymousCart.id },
  });

  cookieStore.delete("anonymousCartId");
  cookieStore.delete("anonymousId");
  return "Cart merged successfully";
}
