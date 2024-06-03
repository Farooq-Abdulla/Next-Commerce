"use server";
import getServerSession from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { cookies } from "next/headers";

export async function GetCartDetails() {
  const session = await getServerSession();
  const user: User | null = session?.user;
  const cookieStore = cookies();
  // const anonymousCartId = await CheckForAnonymousCartId();
  const anonymousId = cookieStore.get("anonymousId")?.value;

  try {
    const CartDetails = await prisma.cart.findFirst({
      where: {
        OR: [{ userId: user?.id }, { anonymousId: anonymousId! }],
      },
      include: {
        CartItem: {
          include: {
            product: true,
          },
        },
      },
    });

    if (CartDetails) {
      // Convert Prisma Decimal to plain JavaScript numbers
      const plainCartDetails = {
        ...CartDetails,
        CartItem: CartDetails.CartItem.map((item) => ({
          ...item,
          product: {
            ...item.product,
            price: item.product.price.toNumber(), // Convert Decimal to number
          },
        })),
      };
      revalidatePath("/");
      return plainCartDetails;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error in getting CartDetails from server", error);
    return null;
  }
}
