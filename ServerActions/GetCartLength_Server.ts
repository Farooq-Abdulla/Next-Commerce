"use server";

import getServerSession from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GetCartLength_Server() {
  try {
    const session = await getServerSession();
    const user = session?.user;
    const cookieStore = cookies();
    const anonymousCartId = cookieStore.get("anonymousCartId")?.value;

    let totalCartLength = 0;
    let totalCartCost = 0;

    if (anonymousCartId) {
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
          where: { id: anonymousCartId },
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
    } else {
      const userCart = await prisma.cart.findFirst({
        where: { userId: user?.id },
        include: {
          CartItem: {
            include: {
              product: true,
            },
          },
        },
      });

      if (userCart) {
        console.log(userCart);
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
