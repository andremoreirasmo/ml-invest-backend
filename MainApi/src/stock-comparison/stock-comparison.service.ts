import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateStockComparisonDto } from './dto/create-stock-comparison.dto';

@Injectable()
export class StockComparisonService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, createStockComparisonDto: CreateStockComparisonDto) {
    return this.prisma.compareHistory.create({
      data: {
        userId,
        CompareHistoryRelation: {
          create: createStockComparisonDto.stocks.map((stock) => ({
            stock_id: stock,
          })),
        },
      },
    });
  }

  async findAll(userId: string) {
    const result = await this.prisma.compareHistory.findMany({
      include: { CompareHistoryRelation: { include: { stock: true } } },
      where: { userId },
    });

    return result.map((history) => {
      return {
        createdAt: history.createdAt,
        stocks: history.CompareHistoryRelation.map(
          (relation) => relation.stock,
        ),
      };
    });
  }
}
