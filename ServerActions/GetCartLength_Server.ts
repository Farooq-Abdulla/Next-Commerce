"use server";

import getServerSession from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GetCartLength_Server() {
  const session = await getServerSession();
  const user = session?.user;
  const cookieStore = cookies();
  const anonymousCartId = cookieStore.get("anonymousCartId")?.value;
  let totalCartLength = 0;
  if (!anonymousCartId) {
    return 0;
  }

  if (user) {
    const userCart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { CartItem: true },
    });

    if (userCart) {
      userCart.CartItem.forEach((item) => {
        totalCartLength += item.quantity;
      });
    }
  } else {
    const anonymousCart = await prisma.cart.findUnique({
      where: { id: anonymousCartId },
      include: { CartItem: true },
    });

    if (anonymousCart) {
      anonymousCart.CartItem.forEach((item) => {
        totalCartLength += item.quantity;
      });
    }
  }

  return totalCartLength;
}
