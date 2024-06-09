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

  const userId = user?.id || null;

  console.log("Anonymous ID:", anonymousId);
  console.log("User ID:", userId);

  // Fetch the most recent active cart for the anonymous ID or user ID
  const existingCart = await prisma.cart.findFirst({
    where: {
      OR: [{ anonymousId }, { userId }],
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      CartItem: true,
    },
  });

  console.log("Existing Cart:", existingCart);

  // Check if we need to create a new cart
  let cartToUse;

  if (existingCart) {
    // If an existing cart is found, determine if it should be used based on userId or anonymousId
    if (userId && existingCart.userId === userId) {
      cartToUse = existingCart;
    } else if (!userId && existingCart.anonymousId === anonymousId) {
      cartToUse = existingCart;
    }
  }

  if (!cartToUse) {
    // No suitable cart found, create a new one
    const newCart = await prisma.cart.create({
      data: {
        userId,
        anonymousId,
        CartItem: {
          create: [
            {
              productId,
              quantity: 1,
            },
          ],
        },
      },
    });

    console.log("New Cart Created:", newCart);
    return;
  }

  // If an existing cart is to be used, check if the product is already in the cart
  const existingCartItem = cartToUse.CartItem.find(
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

    console.log(
      `Updated CartItem ID ${existingCartItem.id} Quantity to ${existingCartItem.quantity + 1}`,
    );
  } else {
    // Add the new product to the cart
    await prisma.cartItem.create({
      data: {
        productId,
        quantity: 1,
        cartId: cartToUse.id,
      },
    });

    console.log(`Added New CartItem to Cart ID ${cartToUse.id}`);
  }
}
