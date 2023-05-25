-- CreateTable
CREATE TABLE "SystemInfo" (
    "id" INT4 NOT NULL,
    "trend_refresh_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "email" STRING NOT NULL,
    "name" STRING NOT NULL,
    "password" STRING NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" INT4 NOT NULL,
    "name" STRING NOT NULL,
    "image" STRING NOT NULL,
    "ticker" STRING NOT NULL,
    "future_price" FLOAT8 NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompareHistoryRelation" (
    "id" STRING NOT NULL,
    "compareHistory_id" STRING NOT NULL,
    "stock_id" INT4 NOT NULL,

    CONSTRAINT "CompareHistoryRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompareHistory" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" STRING NOT NULL,

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
