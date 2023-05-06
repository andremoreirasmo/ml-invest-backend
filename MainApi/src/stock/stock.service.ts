import { Injectable } from '@nestjs/common';
import { Stock } from '@prisma/client';
import axios from 'axios';
import { PrismaService } from 'src/prisma.service';
import yahooFinance from 'yahoo-finance2';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { ChartYahooRoot } from './model/chart-yahoo.model';
import { PeriodEnum, PeriodUtil } from './model/stock-chart.model';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  create(createStockDto: CreateStockDto): Promise<Stock> {
    return this.prisma.stock.create({
      data: {
        ...createStockDto,
      },
    });
  }

  async findAll() {
    //Read AI data
    const result = await this.prisma.stock.findMany();

    const summarys = await Promise.all(
      result.map((stock) =>
        yahooFinance.quoteSummary(stock.ticker, {
          modules: ['price'],
        }),
      ),
    );

    const mapSummary = new Map(
      summarys.map((summary) => [summary.price.symbol, summary]),
    );

    return result.map((stock) => ({
      ...stock,
      stockStatus: 0,
      summary: { ...mapSummary.get(stock.ticker) },
    }));
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

  update(id: number, updateStockDto: UpdateStockDto): Promise<Stock> {
    return this.prisma.stock.update({
      data: {
        ...updateStockDto,
      },
      where: {
        id,
      },
    });
  }

  remove(id: number): Promise<Stock> {
    return this.prisma.stock.delete({
      where: {
        id,
      },
    });
  }
}
