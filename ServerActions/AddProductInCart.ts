"use server";
import getServerSession from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";

export async function AddProductInCart(productId: string) {
  const session = await getServerSession();
  const user = session?.user;
  const cookieStore = cookies();

  let anonymousId = cookieStore.get("anonymousId")?.value || randomUUID();

  if (!cookieStore.get("anonymousId")) {
    cookieStore.set("anonymousId", anonymousId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  let userId = user?.id || null;

  console.log("Anonymous ID:", anonymousId);
  console.log("User ID:", userId);

  // Fetch the most recent active cart for the anonymous ID or user ID
  const mostRecentCart = await prisma.cart.findFirst({
    where: {
      OR: [{ userId: userId }, { anonymousId: anonymousId }],
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      CartItem: true,
    },
  });

  console.log("Most Recent Cart:", mostRecentCart);

  if (!mostRecentCart || mostRecentCart.anonymousId !== anonymousId) {
    // Create a new cart for the user or anonymous ID
    await prisma.cart.create({
      data: {
        userId: userId,
        anonymousId: anonymousId,
        CartItem: {
          create: [
            {
              productId: productId,
              quantity: 1,
            },
          ],
        },
      },
    });
  } else {
    // Check if the product is already in the cart
    const existingCartItem = mostRecentCart.CartItem.find(
      (item) => item.productId === productId,
    );

    if (existingCartItem) {
      // Update the quantity if the product is already in the cart
      await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + 1,
        },
      });
    } else {
      // Add the new product to the cart
      await prisma.cartItem.create({
        data: {
          productId: productId,
          quantity: 1,
          cartId: mostRecentCart.id,
        },
      });
    }
  }
}
