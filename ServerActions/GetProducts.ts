"use server";

import prisma from "@/lib/prisma";

export async function GetAllProducts() {
  try {
    const Products = await prisma.product.findMany();
    console.log(Products);
    return Products;
  } catch (error) {
    console.log(error);
    return [];
  }
}
