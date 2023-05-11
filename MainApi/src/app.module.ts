import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { StockComparisonModule } from './stock-comparison/stock-comparison.module';
import { StockModule } from './stock/stock.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [StockModule, UserModule, AuthModule, StockComparisonModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
