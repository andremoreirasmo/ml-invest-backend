-- DropForeignKey
ALTER TABLE "CompareHistoryRelation" DROP CONSTRAINT "CompareHistoryRelation_compareHistory_id_fkey";

-- AddForeignKey
ALTER TABLE "CompareHistoryRelation" ADD CONSTRAINT "CompareHistoryRelation_compareHistory_id_fkey" FOREIGN KEY ("compareHistory_id") REFERENCES "CompareHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
