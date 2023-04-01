import { Test, TestingModule } from '@nestjs/testing';
import { StockComparisonService } from './stock-comparison.service';

describe('StockComparisonService', () => {
  let service: StockComparisonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockComparisonService],
    }).compile();

    service = module.get<StockComparisonService>(StockComparisonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
