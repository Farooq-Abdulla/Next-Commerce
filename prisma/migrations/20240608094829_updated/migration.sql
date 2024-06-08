/*
  Warnings:

  - Added the required column `amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingCountry` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingEmail` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingState` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingZip` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiptUrl` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCountry` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingState` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingZip` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "billingAddress" TEXT NOT NULL,
ADD COLUMN     "billingCity" TEXT NOT NULL,
ADD COLUMN     "billingCountry" TEXT NOT NULL,
ADD COLUMN     "billingEmail" TEXT NOT NULL,
ADD COLUMN     "billingName" TEXT NOT NULL,
ADD COLUMN     "billingState" TEXT NOT NULL,
ADD COLUMN     "billingZip" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "receiptEmail" TEXT,
ADD COLUMN     "receiptUrl" TEXT NOT NULL,
ADD COLUMN     "shippingAddress" TEXT NOT NULL,
ADD COLUMN     "shippingCity" TEXT NOT NULL,
ADD COLUMN     "shippingCountry" TEXT NOT NULL,
ADD COLUMN     "shippingName" TEXT NOT NULL,
ADD COLUMN     "shippingState" TEXT NOT NULL,
ADD COLUMN     "shippingZip" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
