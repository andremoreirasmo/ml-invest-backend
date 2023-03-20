/*
  Warnings:

  - You are about to drop the column `compareHistoryId` on the `Stock` table. All the data in the column will be lost.
  - Added the required column `stock_id` to the `CompareHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_compareHistoryId_fkey";

-- AlterTable
ALTER TABLE "CompareHistory" ADD COLUMN     "stock_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "compareHistoryId";

-- CreateTable
CREATE TABLE "CompareHistoryRelation" (
    "id" SERIAL NOT NULL,
    "compareHistory_id" INTEGER NOT NULL,
    "stock_id" INTEGER NOT NULL,

    CONSTRAINT "CompareHistoryRelation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompareHistoryRelation" ADD CONSTRAINT "CompareHistoryRelation_compareHistory_id_fkey" FOREIGN KEY ("compareHistory_id") REFERENCES "CompareHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompareHistoryRelation" ADD CONSTRAINT "CompareHistoryRelation_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
