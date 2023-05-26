import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateStockComparisonDto } from './dto/create-stock-comparison.dto';
import { StockComparisonService } from './stock-comparison.service';

@Controller('stock-comparison')
@UseGuards(JwtAuthGuard)
export class StockComparisonController {
  constructor(
    private readonly stockComparisonService: StockComparisonService,
  ) {}

  @Post()
  create(
    @Request() req: any,
    @Body() createStockComparisonDto: CreateStockComparisonDto,
  ) {
    Logger.log('StockComparisonController create');
    return this.stockComparisonService.create(
      req.user.id,
      createStockComparisonDto,
    );
  }

  @Get()
  findAll(@Request() req: any) {
    Logger.log('StockComparisonController findAll');
    return this.stockComparisonService.findAll(req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    Logger.log('StockComparisonController remove');
    return this.stockComparisonService.remove(id);
  }
}
