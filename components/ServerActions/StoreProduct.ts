"use server";

import prisma from "@/lib/prisma";

interface ProductProps {
  ProductName: string;
  ProductDescription: string;
  ProductImage: string;
  ProductPrice: number;
}
export async function StoreProduct({
  ProductName,
  ProductDescription,
  ProductImage,
  ProductPrice,
}: ProductProps) {
  try {
    await prisma.product.create({
      data: {
        name: ProductName,
        description: ProductDescription,
        imageUrl: ProductImage,
        price: ProductPrice,
      },
    });
    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
}
