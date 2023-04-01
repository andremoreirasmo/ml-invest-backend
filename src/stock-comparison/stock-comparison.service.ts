import { Injectable } from '@nestjs/common';
import { CreateStockComparisonDto } from './dto/create-stock-comparison.dto';
import { UpdateStockComparisonDto } from './dto/update-stock-comparison.dto';

@Injectable()
export class StockComparisonService {
  create(createStockComparisonDto: CreateStockComparisonDto) {
    return 'This action adds a new stockComparison';
  }

  findAll() {
    return `This action returns all stockComparison`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockComparison`;
  }

  update(id: number, updateStockComparisonDto: UpdateStockComparisonDto) {
    return `This action updates a #${id} stockComparison`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockComparison`;
  }
}
