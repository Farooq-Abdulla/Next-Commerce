"use server";
import getServerSession from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";

export async function AddProductInCart(productId: string) {
  const session = await getServerSession();
  const user = session?.user;
  const cookieStore = cookies();

  let userId = user?.id || null;
  let anonymousId = cookieStore.get("anonymousId")?.value;

  if (!anonymousId) {
    anonymousId = randomUUID();
    cookieStore.set("anonymousId", anonymousId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  // console.log("Anonymous ID:", anonymousId);
  // console.log("User ID:", userId);

  // Check if a cart already exists for the user or anonymous ID
  const existingCart = await prisma.cart.findFirst({
    where: {
      OR: [{ anonymousId }, { userId }],
      isArchived: false,
    },
    include: {
      CartItem: true,
    },
  });

  console.log("Existing Cart:", existingCart);

  if (!existingCart) {
    // Create a new cart for the user or anonymous ID
    await prisma.cart.create({
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

    // console.log("New Cart Created");
  } else {
    // Check if the product is already in the cart
    const existingCartItem = existingCart.CartItem.find(
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
          cartId: existingCart.id,
        },
      });

      console.log(`Added new product to Cart ID ${existingCart.id}`);
    }
  }
}
