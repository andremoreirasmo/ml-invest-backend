-- DropForeignKey
ALTER TABLE "CompareHistory" DROP CONSTRAINT "CompareHistory_userId_fkey";

-- AddForeignKey
ALTER TABLE "CompareHistory" ADD CONSTRAINT "CompareHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
