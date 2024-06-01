"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function RemoveProductFromCart(itemId: string, cartId: string) {
  try {
    await prisma.cartItem.deleteMany({
      where: {
        id: itemId,
        cartId: cartId,
      },
    });
    revalidatePath("/cart");
    return "Product removed successfully";
  } catch (error: any) {
    console.log("Error removing product from cart ", error);
  }
}
