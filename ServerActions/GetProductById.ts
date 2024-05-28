"use sever";

import prisma from "@/lib/prisma";

export async function GetProductById(productId: string) {
  try {
    return await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
  } catch (error: any) {
    console.log("Error getting product Id : " + error.message);
    return null;
  }
}
