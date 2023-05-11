import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma.service';
import { TrendStockRequestDTO } from './model/dto/TrendStockRequest.dto';
import { TrendStockEnum } from './model/enums/trend-stock.enum';

@Injectable()
export class TrendStockService {
  constructor(private prisma: PrismaService) {}

  async refreshData() {
    const stocks = await this.prisma.stock.findMany();

    for (const stock of stocks) {
      Logger.log(`refreshing ${stock.ticker} `);

      const response = await axios.get<TrendStockRequestDTO>(
        process.env.API_URL_TREND + '/metrics',
        {
          params: {
            ticker: stock.ticker,
          },
        },
      );

      Logger.log(`received data:`, [response.data]);

      const future_price = response.data.future_price;

      Logger.log(`future_price`, [future_price]);
      Logger.log(`stock`, [stock]);
      await this.prisma.stock.update({
        where: { id: stock.id },
        data: {
          future_price,
        },
      });
    }

    const trend_refresh_time = new Date();

    Logger.log(`finished refresh:`, [trend_refresh_time]);

    await this.prisma.systemInfo.upsert({
      create: { id: 1, trend_refresh_time },
      update: { trend_refresh_time },
      where: { id: 1 },
    });
  }

  getTrendStock(stockPrice: number, futurePrice: number): TrendStockEnum {
    const diff = futurePrice - stockPrice;
    const percentVariable = (diff / stockPrice) * 100;

    if (percentVariable > 1) {
      return TrendStockEnum.up;
    } else if (percentVariable < -1) {
      return TrendStockEnum.down;
    }

    return TrendStockEnum.flat;
  }
}
