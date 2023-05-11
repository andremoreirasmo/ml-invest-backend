import { Module } from '@nestjs/common';
import { StockComparisonService } from './stock-comparison.service';
import { StockComparisonController } from './stock-comparison.controller';

@Module({
  controllers: [StockComparisonController],
  providers: [StockComparisonService],
})
export class StockComparisonModule {}
