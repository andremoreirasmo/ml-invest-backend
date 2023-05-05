import { Injectable } from '@nestjs/common';
import { Stock } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import yahooFinance from 'yahoo-finance2';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
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
    return yahooFinance._chart(ticker, {
      period1: PeriodUtil.getPeriod(period),
      interval: PeriodUtil.getInterval(period),
      includePrePost: false,
    });
  }

  async findOne(id: number, period: PeriodEnum) {
    const result = await this.prisma.stock.findUnique({
      where: {
        id,
      },
    });

    let summary = await yahooFinance.quoteSummary(result.ticker, {
      modules: [
        'assetProfile',
        'summaryDetail',
        'price',
        'summaryProfile',
        'summaryDetail',
        'quoteType',
      ],
    });

    const price = summary.price;
    const chart = await this.getChart(result.ticker, period);

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
