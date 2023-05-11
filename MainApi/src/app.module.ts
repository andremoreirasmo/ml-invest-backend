import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { StockModule } from './stock/stock.module';
import { UserModule } from './user/user.module';
import { StockComparisonModule } from './stock-comparison/stock-comparison.module';
import { TrendStockModule } from './trend-stock/trend-stock.module';

@Module({
  imports: [StockModule, UserModule, AuthModule, StockComparisonModule, TrendStockModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
