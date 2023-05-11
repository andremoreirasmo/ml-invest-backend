import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TrendStockController } from './trend-stock.controller';
import { TrendStockService } from './trend-stock.service';

@Module({
  controllers: [TrendStockController],
  providers: [TrendStockService, PrismaService],
})
export class TrendStockModule {}
