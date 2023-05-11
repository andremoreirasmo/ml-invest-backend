import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ChartYahooDTO } from './model/dto/chart-yahoo.dto';
import { PeriodEnum, PeriodUtil } from './model/enums/stock-chart.enum';

@Injectable()
export class ChartStockService {
  async getChart(ticker: string, period: PeriodEnum) {
    const options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart',
      params: {
        interval: PeriodUtil.getInterval(period),
        symbol: ticker,
        range: PeriodUtil.getRange(period),
        region: 'br',
        includePrePost: 'false',
        useYfid: 'true',
      },
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY_RAPID,
      },
    };

    const response = await axios.request<ChartYahooDTO>(options);
    const chart = response.data.chart.result[0];

    return chart.timestamp.map((utcSeconds, i) => ({
      date: new Date(utcSeconds * 1000),
      high: chart.indicators.quote[0].high[i],
      close: chart.indicators.quote[0].close[i],
      volume: chart.indicators.quote[0].volume[i],
      open: chart.indicators.quote[0].open[i],
      low: chart.indicators.quote[0].low[i],
    }));
  }
}
