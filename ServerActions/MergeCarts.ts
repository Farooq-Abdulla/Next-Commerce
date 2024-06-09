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

  // Fetch all active carts for the user, ordered by creation date
  const userCarts = await prisma.cart.findMany({
    where: {
      userId: user.id,
      isArchived: false,
    },
    orderBy: { createdAt: "desc" },
    include: { CartItem: true },
  });
  // console.log(userCarts);

  if (userCarts.length === 0) {
    // Create a new cart for the user and merge anonymous cart items
    await prisma.cart.create({
      data: {
        userId: user.id,
        isArchived: false,
        CartItem: {
          create: anonymousCart.CartItem.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });
  } else {
    const userCart = userCarts[0]; // Consider the most recently created cart for merging

    for (const item of anonymousCart.CartItem) {
      const existingItem = userCart.CartItem.find(
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

  // Check again if the anonymous cart exists before deleting
  const checkAnonymousCart = await prisma.cart.findUnique({
    where: { id: anonymousCart.id },
  });
  // console.log("checkAnonymousCart : " + checkAnonymousCart);

  if (checkAnonymousCart) {
    await prisma.cart.delete({
      where: { id: anonymousCart.id },
    });
  }

  cookieStore.delete("anonymousCartId");
  cookieStore.delete("anonymousId");
  return "Cart merged successfully";
}
