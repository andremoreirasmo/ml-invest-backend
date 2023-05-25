import {
  Body,
  Controller,
  Get,
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
    return this.stockComparisonService.create(
      req.user.id,
      createStockComparisonDto,
    );
  }

  @Get()
  findAll(@Request() req: any) {
    return this.stockComparisonService.findAll(req.user.id);
  }
}
