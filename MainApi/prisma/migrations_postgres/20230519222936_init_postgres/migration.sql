-- CreateTable
CREATE TABLE "SystemInfo" (
    "id" INTEGER NOT NULL,
    "trend_refresh_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "future_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompareHistoryRelation" (
    "id" TEXT NOT NULL,
    "compareHistory_id" TEXT NOT NULL,
    "stock_id" INTEGER NOT NULL,

    CONSTRAINT "CompareHistoryRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompareHistory" (
    "id" TEXT NOT NULL,
    "stock_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CompareHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_name_key" ON "Stock"("name");

-- AddForeignKey
ALTER TABLE "CompareHistoryRelation" ADD CONSTRAINT "CompareHistoryRelation_compareHistory_id_fkey" FOREIGN KEY ("compareHistory_id") REFERENCES "CompareHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompareHistoryRelation" ADD CONSTRAINT "CompareHistoryRelation_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompareHistory" ADD CONSTRAINT "CompareHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
