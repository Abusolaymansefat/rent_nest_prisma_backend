/*
  Warnings:

  - The values [SSLCOMMERZ] on the enum `PaymentProvider` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `method` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `rentalRequest` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[rentalRequestId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rentalRequestId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentProvider_new" AS ENUM ('STRIPE');
ALTER TABLE "payments" ALTER COLUMN "provider" TYPE "PaymentProvider_new" USING ("provider"::text::"PaymentProvider_new");
ALTER TYPE "PaymentProvider" RENAME TO "PaymentProvider_old";
ALTER TYPE "PaymentProvider_new" RENAME TO "PaymentProvider";
DROP TYPE "public"."PaymentProvider_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_rentalRequestId_fkey";

-- DropForeignKey
ALTER TABLE "rentalRequest" DROP CONSTRAINT "rentalRequest_landlordId_fkey";

-- DropForeignKey
ALTER TABLE "rentalRequest" DROP CONSTRAINT "rentalRequest_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "rentalRequest" DROP CONSTRAINT "rentalRequest_tenantId_fkey";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "method",
ALTER COLUMN "provider" SET DEFAULT 'STRIPE';

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "rentalRequestId" TEXT NOT NULL;

-- DropTable
DROP TABLE "rentalRequest";

-- CreateTable
CREATE TABLE "rental_requests" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "landlordId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "moveInDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "message" TEXT,
    "status" "RentalStatus" NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "rejectedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rental_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_rentalRequestId_key" ON "reviews"("rentalRequestId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_rentalRequestId_fkey" FOREIGN KEY ("rentalRequestId") REFERENCES "rental_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_requests" ADD CONSTRAINT "rental_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_requests" ADD CONSTRAINT "rental_requests_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_requests" ADD CONSTRAINT "rental_requests_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rentalRequestId_fkey" FOREIGN KEY ("rentalRequestId") REFERENCES "rental_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
