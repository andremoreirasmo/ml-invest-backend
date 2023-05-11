import { Test, TestingModule } from '@nestjs/testing';
import { TrendStockService } from './trend-stock.service';

describe('TrendStockService', () => {
  let service: TrendStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrendStockService],
    }).compile();

    service = module.get<TrendStockService>(TrendStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
