import { Controller, Get } from '@nestjs/common';
import { TrendStockService } from './trend-stock.service';

@Controller('trend-stock')
export class TrendStockController {
  constructor(private readonly trendStockService: TrendStockService) {}

  @Get('refreshData')
  refreshData() {
    return this.trendStockService.refreshData();
  }
}
