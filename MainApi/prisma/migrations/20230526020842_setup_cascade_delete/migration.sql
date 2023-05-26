-- DropForeignKey
ALTER TABLE "CompareHistory" DROP CONSTRAINT "CompareHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "CompareHistoryRelation" DROP CONSTRAINT "CompareHistoryRelation_compareHistory_id_fkey";

-- AddForeignKey
ALTER TABLE "CompareHistoryRelation" ADD CONSTRAINT "CompareHistoryRelation_compareHistory_id_fkey" FOREIGN KEY ("compareHistory_id") REFERENCES "CompareHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompareHistory" ADD CONSTRAINT "CompareHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
