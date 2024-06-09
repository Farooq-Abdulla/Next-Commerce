"use server";
import getServerSession from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";

export async function AddProductInCart(productId: string) {
  const session = await getServerSession();
  const user = session?.user;
  const cookieStore = cookies();

  // Retrieve the anonymous ID from the cookies, or create a new one if it doesn't exist
  let anonymousId = cookieStore.get("anonymousId")?.value || randomUUID();

  // Set the anonymous ID in the cookies if it doesn't already exist
  if (!cookieStore.get("anonymousId")) {
    // This sets a cookie in the response headers, which the browser will save
    cookieStore.set("anonymousId", anonymousId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    }); // cookie lasts for 30 days
  }

  let userId = user?.id || null;

  console.log("Anonymous ID:", anonymousId);
  console.log("User ID:", userId);

  // Fetch the most recent active cart for the user or anonymous ID, ordered by creation date
  const existingCarts = await prisma.cart.findMany({
    where: {
      OR: [
        { userId: userId, isArchived: false },
        { anonymousId: anonymousId, isArchived: false },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      CartItem: true,
    },
  });

  // Find the cart that matches either the user ID or anonymous ID specifically
  const mostRecentCart = existingCarts.find(
    (cart) => cart.anonymousId === anonymousId || cart.userId === userId,
  );

  console.log("Most Recent Cart:", mostRecentCart);

  if (!mostRecentCart) {
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
