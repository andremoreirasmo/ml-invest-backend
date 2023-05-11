import { Test, TestingModule } from '@nestjs/testing';
import { TrendStockController } from './trend-stock.controller';
import { TrendStockService } from './trend-stock.service';

describe('TrendStockController', () => {
  let controller: TrendStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrendStockController],
      providers: [TrendStockService],
    }).compile();

    controller = module.get<TrendStockController>(TrendStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
