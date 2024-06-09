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

  if (userId) {
    // Handle logic for authenticated user carts
    await handleUserCart(productId, userId);
  } else {
    // Handle logic for anonymous user carts
    await handleAnonymousCart(productId, anonymousId);
  }
}
async function handleUserCart(productId: string, userId: string) {
  const existingCart = await prisma.cart.findFirst({
    where: {
      userId,
      isArchived: false,
    },
    include: {
      CartItem: true,
    },
  });

  // console.log("Existing Cart for User ID:", userId, existingCart);

  if (!existingCart) {
    await prisma.cart.create({
      data: {
        userId,
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
  } else {
    const existingCartItem = existingCart.CartItem.find(
      (item) => item.productId === productId,
    );

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + 1,
        },
      });

      // console.log(
      //   `Updated CartItem ID ${existingCartItem.id} Quantity to ${existingCartItem.quantity + 1}`,
      // );
    } else {
      await prisma.cartItem.create({
        data: {
          productId,
          quantity: 1,
          cartId: existingCart.id,
        },
      });

      // console.log(`Added new product to Cart ID ${existingCart.id}`);
    }
  }
}

async function handleAnonymousCart(productId: string, anonymousId: string) {
  const existingCart = await prisma.cart.findFirst({
    where: {
      anonymousId,
      isArchived: false,
    },
    include: {
      CartItem: true,
    },
  });

  // console.log("Existing Cart for Anonymous ID:", anonymousId, existingCart);

  if (!existingCart) {
    await prisma.cart.create({
      data: {
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
  } else {
    const existingCartItem = existingCart.CartItem.find(
      (item) => item.productId === productId,
    );

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + 1,
        },
      });

      // console.log(
      //   `Updated CartItem ID ${existingCartItem.id} Quantity to ${existingCartItem.quantity + 1}`,
      // );
    } else {
      await prisma.cartItem.create({
        data: {
          productId,
          quantity: 1,
          cartId: existingCart.id,
        },
      });

      // console.log(`Added new product to Cart ID ${existingCart.id}`);
    }
  }
}
