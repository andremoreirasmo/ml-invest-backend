import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateStockComparisonDto } from './dto/create-stock-comparison.dto';
import { UpdateStockComparisonDto } from './dto/update-stock-comparison.dto';
import { StockComparisonService } from './stock-comparison.service';

@Controller('stock-comparison')
export class StockComparisonController {
  constructor(
    private readonly stockComparisonService: StockComparisonService,
  ) {}

  @Post()
  create(@Body() createStockComparisonDto: CreateStockComparisonDto) {
    return this.stockComparisonService.create(createStockComparisonDto);
  }

  @Get()
  findAll() {
    return this.stockComparisonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockComparisonService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStockComparisonDto: UpdateStockComparisonDto,
  ) {
    return this.stockComparisonService.update(+id, updateStockComparisonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockComparisonService.remove(+id);
  }
}
