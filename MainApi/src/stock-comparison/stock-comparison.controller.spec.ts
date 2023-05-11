import { Test, TestingModule } from '@nestjs/testing';
import { StockComparisonController } from './stock-comparison.controller';
import { StockComparisonService } from './stock-comparison.service';

describe('StockComparisonController', () => {
  let controller: StockComparisonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockComparisonController],
      providers: [StockComparisonService],
    }).compile();

    controller = module.get<StockComparisonController>(
      StockComparisonController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
