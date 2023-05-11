import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma.service';
import { TrendStockRequest } from './dto/TrendStockRequest';

@Injectable()
export class TrendStockService {
  constructor(private prisma: PrismaService) {}

  async refreshData() {
    const stocks = await this.prisma.stock.findMany();

    for (const stock of stocks) {
      Logger.log(
        `refreshing ${stock.ticker}, API: ${
          process.env.API_URL_TREND + '/metrics'
        }`,
      );

      const response = await axios.get<TrendStockRequest>(
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
}
