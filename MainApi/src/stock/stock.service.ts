import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import yahooFinance from 'yahoo-finance2';

import { ChartStockService } from './chart-stock.service';
import { PeriodEnum } from './model/enums/stock-chart.enum';
import { TrendStockService } from './trend-stock.service';

@Injectable()
export class StockService {
  constructor(
    private prisma: PrismaService,
    private chartStockService: ChartStockService,
    private trendStockService: TrendStockService,
  ) {}

  async findAll() {
    const result = await this.prisma.stock.findMany();

    const summaries = await Promise.all(
      result.map((stock) =>
        yahooFinance.quoteSummary(stock.ticker, {
          modules: ['price', 'quoteType'],
        }),
      ),
    );

    const mapSummary = new Map(
      summaries.map((summary) => [summary.quoteType.symbol, summary]),
    );

    return result.map((stock) => {
      const summary = mapSummary.get(stock.ticker);
      const trendStock = this.trendStockService.getTrendStock(
        summary.price?.regularMarketPrice,
        stock.future_price,
      );

      return {
        ...stock,
        trendStock,
        summary: { ...summary },
      };
    });
  }

  async findOne(id: number, period: PeriodEnum) {
    const stock = await this.prisma.stock.findUnique({
      where: {
        id,
      },
    });

    const promiseSummary = yahooFinance.quoteSummary(stock.ticker, {
      modules: [
        'assetProfile',
        'summaryDetail',
        'price',
        'summaryProfile',
        'summaryDetail',
        'quoteType',
      ],
    });

    const promiseChart = this.chartStockService.getChart(stock.ticker, period);

    const results = await Promise.all([promiseSummary, promiseChart]);

    let summary = results[0];
    const chart = results[1];
    const price = summary.price;

    summary = {
      ...summary,
      price: {
        ...price,
        regularMarketChangePercent:
          (price.regularMarketChange * 100) / price.regularMarketPreviousClose,
      },
    };

    const trendStock = this.trendStockService.getTrendStock(
      summary.price?.regularMarketPrice,
      stock.future_price,
    );

    return { ...stock, trendStock, summary, chart };
  }
}
