import { PartialType } from '@nestjs/mapped-types';
import { CreateStockComparisonDto } from './create-stock-comparison.dto';

export class UpdateStockComparisonDto extends PartialType(
  CreateStockComparisonDto,
) {}
