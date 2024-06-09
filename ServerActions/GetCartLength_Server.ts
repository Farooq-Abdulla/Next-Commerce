"use server";

import getServerSession from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GetCartLength_Server() {
  try {
    const session = await getServerSession();
    const user = session?.user;
    const cookieStore = cookies();
    const anonymousId = cookieStore.get("anonymousId")?.value;

    let totalCartLength = 0;
    let totalCartCost = 0;

    if (anonymousId) {
      if (user) {
        const userCarts = await prisma.cart.findMany({
          where: { userId: user.id },
          include: {
            CartItem: {
              include: {
                product: true,
              },
            },
          },
        });

        userCarts.forEach((cart) => {
          if (cart.isArchived === false) {
            cart.CartItem.forEach((item) => {
              totalCartLength += item.quantity;
              totalCartCost += item.product.price.toNumber() * item.quantity;
            });
          }
        });
      } else {
        const anonymousCart = await prisma.cart.findFirst({
          where: { anonymousId: anonymousId },
          include: {
            CartItem: {
              include: {
                product: true,
              },
            },
          },
        });

        if (anonymousCart) {
          anonymousCart.CartItem.forEach((item) => {
            totalCartLength += item.quantity;
            totalCartCost += item.product.price.toNumber() * item.quantity;
          });
        }
      }
    } else if (user) {
      const userCarts = await prisma.cart.findMany({
        where: { userId: user.id },
        include: {
          CartItem: {
            include: {
              product: true,
            },
          },
        },
      });

      userCarts.forEach((cart) => {
        if (cart.isArchived === false) {
          cart.CartItem.forEach((item) => {
            totalCartLength += item.quantity;
            totalCartCost += item.product.price.toNumber() * item.quantity;
          });
        }
      });
    }

    return { totalCartLength, totalCartCost };
  } catch (error) {
    console.error("Error fetching cart details:", error);
    return { totalCartLength: 0, totalCartCost: 0 };
  }
}
