import { Controller, Get, Logger, Query } from '@nestjs/common';

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

  @Get('find')
  findStock(
    @Query('ticker') tickers: string | string[],
    @Query('period') period: keyofPeriodEnum,
  ) {
    Logger.log(`findStock  ${JSON.stringify(tickers)}`);
    if (typeof tickers === 'string') {
      return this.stockService.findOne(tickers, PeriodEnum[period]);
    }

    return this.stockService.findStocks(tickers, PeriodEnum[period]);
  }

  @Get('chart')
  getChart(
    @Query('ticker') tickers: string | string[],
    @Query('period') period: keyofPeriodEnum,
  ) {
    Logger.log(`getChart ${JSON.stringify(tickers)}`);
    if (typeof tickers === 'string') {
      return this.chartStockService.getChart(tickers, PeriodEnum[period]);
    }

    return this.chartStockService.getCharts(tickers, PeriodEnum[period]);
  }

  @Get('trend/refreshData')
  refreshDataFuturePrice() {
    Logger.log('refreshDataFuturePrice');
    return this.trendStockService.refreshData();
  }

  @Get('trend/lastRefresh')
  getLastRefreshTrend() {
    Logger.log('getLastRefreshTrend');
    return this.trendStockService.getLastRefreshTrend();
  }
}
