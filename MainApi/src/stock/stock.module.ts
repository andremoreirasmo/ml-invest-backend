import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ChartStockService } from './chart-stock.service';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { TrendStockService } from './trend-stock.service';

@Module({
  controllers: [StockController],
  providers: [
    StockService,
    PrismaService,
    TrendStockService,
    ChartStockService,
  ],
})
export class StockModule {}
