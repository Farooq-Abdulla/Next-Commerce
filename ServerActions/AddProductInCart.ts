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
  let anonymousId = cookieStore.get("anonymousId")?.value || randomUUID();

  if (!cookieStore.get("anonymousId")) {
    cookieStore.set("anonymousId", anonymousId);
  }

  // Fetch all active carts for the user or anonymous ID, ordered by creation date
  const existingCarts = await prisma.cart.findMany({
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

  const mostRecentCart = existingCarts.length > 0 ? existingCarts[0] : null;

  if (!mostRecentCart) {
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
    const existingCartItem = mostRecentCart.CartItem.find(
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
    } else {
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
