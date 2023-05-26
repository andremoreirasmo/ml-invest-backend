import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ComparisonDTO } from './dto/comparison.dto';
import { CreateStockComparisonDto } from './dto/create-stock-comparison.dto';

@Injectable()
export class StockComparisonService {
  constructor(private prisma: PrismaService) {}

  private parseComparison(comparison: ComparisonDTO) {
    return {
      id: comparison.id,
      createdAt: comparison.createdAt,
      stocks: comparison.CompareHistoryRelation.map(
        (relation) => relation.stock,
      ),
    };
  }

  async create(
    userId: string,
    createStockComparisonDto: CreateStockComparisonDto,
  ) {
    const created = await this.prisma.compareHistory.create({
      data: {
        userId,
        CompareHistoryRelation: {
          create: createStockComparisonDto.stocks.map((stock) => ({
            stock_id: stock,
          })),
        },
      },
      include: {
        CompareHistoryRelation: { include: { stock: true } },
      },
    });

    return this.parseComparison(created);
  }

  async findAll(userId: string) {
    const result = await this.prisma.compareHistory.findMany({
      include: { CompareHistoryRelation: { include: { stock: true } } },
      where: { userId },
    });

    return result.map((comparison) => this.parseComparison(comparison));
  }

  remove(id: string) {
    return this.prisma.compareHistory.delete({
      where: { id },
      include: { CompareHistoryRelation: true },
    });
  }
}
