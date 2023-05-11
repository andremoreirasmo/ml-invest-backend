import { Controller, Get, Param, Query } from '@nestjs/common';

import { keyofPeriodEnum, PeriodEnum } from './model/enums/stock-chart.enum';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  findAll() {
    return this.stockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('period') period: keyofPeriodEnum) {
    return this.stockService.findOne(+id, PeriodEnum[period]);
  }

  @Get('chart/:ticker')
  getChart(
    @Param('ticker') ticker: string,
    @Query('period') period: keyofPeriodEnum,
  ) {
    return this.stockService.getChart(ticker, PeriodEnum[period]);
  }
}
