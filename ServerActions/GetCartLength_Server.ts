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
        const userCart = await prisma.cart.findUnique({
          where: { userId: user.id },
          include: {
            CartItem: {
              include: {
                product: true,
              },
            },
          },
        });

        if (userCart) {
          userCart.CartItem.forEach((item) => {
            totalCartLength += item.quantity;
            totalCartCost += item.product.price.toNumber() * item.quantity;
          });
        }
      } else {
        const anonymousCart = await prisma.cart.findUnique({
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
      const userCart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: {
          CartItem: {
            include: {
              product: true,
            },
          },
        },
      });

      if (userCart) {
        userCart.CartItem.forEach((item) => {
          totalCartLength += item.quantity;
          totalCartCost += item.product.price.toNumber() * item.quantity;
        });
      } else {
        totalCartLength = 0;
      }
    }

    return { totalCartLength, totalCartCost };
  } catch (error) {
    console.error("Error fetching cart details:", error);
    return { totalCartLength: 0, totalCartCost: 0 };
  }
}
