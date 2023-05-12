import { Controller, Get, Logger, Param, Query } from '@nestjs/common';

import { ChartStockService } from './chart-stock.service';
import { keyofPeriodEnum, PeriodEnum } from './model/enums/stock-chart.enum';
import { StockService } from './stock.service';
import { TrendStockService } from './trend-stock.service';

@Controller('stock')
export class StockController {
  constructor(
    private stockService: StockService,
    private chartStockService: ChartStockService,
    private trendStockService: TrendStockService,
  ) {}

  @Get()
  findAll() {
    return this.stockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('period') period: keyofPeriodEnum) {
    Logger.log('findOne');
    return this.stockService.findOne(+id, PeriodEnum[period]);
  }

  @Get('chart/:ticker')
  getChart(
    @Param('ticker') ticker: string,
    @Query('period') period: keyofPeriodEnum,
  ) {
    Logger.log('getChart');
    return this.chartStockService.getChart(ticker, PeriodEnum[period]);
  }

  @Get('trend/refreshData')
  refreshDataFuturePrice() {
    Logger.log('trendrefreshData');
    return this.trendStockService.refreshData();
  }
}
