import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ChartYahooDTO } from './model/dto/chart-yahoo.dto';
import { PeriodEnum, PeriodUtil } from './model/enums/stock-chart.enum';

@Injectable()
export class ChartStockService {
  async getChart(ticker: string, period: PeriodEnum) {
    try {
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

      if (!chart.timestamp) {
        return [];
      }

      return chart.timestamp.map((utcSeconds, i) => ({
        date: new Date(utcSeconds * 1000),
        high: chart.indicators.quote[0].high[i],
        close: chart.indicators.quote[0].close[i],
        volume: chart.indicators.quote[0].volume[i],
        open: chart.indicators.quote[0].open[i],
        low: chart.indicators.quote[0].low[i],
      }));
    } catch (error) {
      Logger.error('Erro ao localizar os gráficos', error);
      return [];
    }
  }

  async getCharts(tickers: string[], period: PeriodEnum) {
    const charts = await Promise.all(
      tickers.map(async (ticker) => {
        const chart = await this.getChart(ticker, period);

        return {
          ticker,
          chart,
        };
      }),
    );

    return charts;
  }
}
