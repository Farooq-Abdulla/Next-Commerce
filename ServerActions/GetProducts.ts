"use server";

import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function GetAllProducts() {
  try {
    const Products = await prisma.product.findMany();
    const plainProducts = Products.map((product) => ({
      ...product,
      price:
        product.price instanceof Decimal
          ? product.price.toNumber()
          : product.price,
    }));
    return plainProducts;
  } catch (error) {
    console.log(error);
    return [];
  }
}
