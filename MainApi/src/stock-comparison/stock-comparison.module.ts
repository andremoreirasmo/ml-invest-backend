import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { StockComparisonController } from './stock-comparison.controller';
import { StockComparisonService } from './stock-comparison.service';

@Module({
  controllers: [StockComparisonController],
  providers: [StockComparisonService, PrismaService],
})
export class StockComparisonModule {}
