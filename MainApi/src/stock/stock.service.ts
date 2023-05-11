import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma.service';
import yahooFinance from 'yahoo-finance2';
import { ChartYahooRoot } from './model/chart-yahoo.model';
import { PeriodEnum, PeriodUtil } from './model/enums/stock-chart.enum';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    Logger.log('findAll');
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

      Logger.log('Stock', [stock, summary]);
      return {
        ...stock,
        summary: { ...summary },
      };
    });
  }

  async getChart(ticker: string, period: PeriodEnum) {
    const options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart',
      params: {
        interval: PeriodUtil.getInterval(period),
        symbol: ticker,
        range: PeriodUtil.getRange(period),
        region: 'br',
        includePrePost: 'false',
        useYfid: 'true',
      },
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY_RAPID,
      },
    };

    const response = await axios.request<ChartYahooRoot>(options);
    const chart = response.data.chart.result[0];

    return chart.timestamp.map((utcSeconds, i) => ({
      date: new Date(utcSeconds * 1000),
      high: chart.indicators.quote[0].high[i],
      close: chart.indicators.quote[0].close[i],
      volume: chart.indicators.quote[0].volume[i],
      open: chart.indicators.quote[0].open[i],
      low: chart.indicators.quote[0].low[i],
    }));
  }

  async findOne(id: number, period: PeriodEnum) {
    const result = await this.prisma.stock.findUnique({
      where: {
        id,
      },
    });

    const promiseSummary = yahooFinance.quoteSummary(result.ticker, {
      modules: [
        'assetProfile',
        'summaryDetail',
        'price',
        'summaryProfile',
        'summaryDetail',
        'quoteType',
      ],
    });

    const promiseChart = this.getChart(result.ticker, period);

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

    return { ...result, stockStatus: 0, summary, chart };
  }
}
