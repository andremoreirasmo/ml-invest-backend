import { Injectable } from '@nestjs/common';
import { Stock } from '@prisma/client';
import { addYears } from 'date-fns';
import { PrismaService } from 'src/prisma.service';
import yahooFinance from 'yahoo-finance2';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

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

  async findOne(id: number) {
    const result = await this.prisma.stock.findUnique({
      where: {
        id,
      },
    });

    const promiseSummary = yahooFinance.quoteSummary(result.ticker, {
      modules: [
        'assetProfile',
        'price',
        'summaryDetail',
        'summaryDetail',
        'financialData',
        'fundProfile',
      ],
    });

    const fiveYearsAgo = addYears(new Date(), -5);
    const promiseChart = yahooFinance._chart(result.ticker, {
      period1: fiveYearsAgo,
      lang: 'pt-BR',
    });

    // eslint-disable-next-line prefer-const
    let [summary, chart] = await Promise.all([promiseSummary, promiseChart]);

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
