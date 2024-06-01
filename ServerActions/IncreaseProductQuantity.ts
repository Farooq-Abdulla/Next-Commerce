"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function IncreaseProductQuantity(itemId: string, cardId: string) {
  try {
    await prisma.cartItem.update({
      where: {
        id: itemId,
        cartId: cardId,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });
    revalidatePath("/cart");
    return "Product quantity increased successfully";
  } catch (error: any) {
    console.log("Error increasing product quantity ", error);
  }
}
