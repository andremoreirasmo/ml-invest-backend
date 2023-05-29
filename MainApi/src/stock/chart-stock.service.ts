import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ChartModel, ChartQuotes } from './model/chart.model';
import { ChartYahooDTO, Result } from './model/dto/chart-yahoo.dto';
import { PeriodEnum, PeriodUtil } from './model/enums/stock-chart.enum';

@Injectable()
export class ChartStockService {
  private getOptions(ticker: string, period: PeriodEnum, apiKey?: string) {
    return {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart',
      params: {
        interval: PeriodUtil.getInterval(period),
        symbol: ticker,
        range: PeriodUtil.getRange(period),
        region: 'br',
        includePrePost: 'false',
        useYfid: 'true',
      } as any,
      headers: {
        'X-RapidAPI-Key': apiKey ?? process.env.API_KEY_RAPID,
      },
    };
  }

  async getChart(
    ticker: string,
    period: PeriodEnum,
    apiKey?: string,
  ): Promise<ChartQuotes[]> {
    try {
      const options = this.getOptions(ticker, period, apiKey);

      const response = await axios.request<ChartYahooDTO>(options);

      return this.parseChart(response.data.chart.result[0]);
    } catch (error) {
      if (error instanceof AxiosError && apiKey == undefined) {
        return this.getChart(ticker, period, process.env.API_KEY_RAPID_2);
      }
      Logger.error('Erro ao localizar os gráficos', error);
      return [];
    }
  }

  private parseChart(chart: Result): ChartQuotes[] {
    if (!chart.timestamp) {
      return [];
    }

    return chart.timestamp.map((utcSeconds, i) => ({
      date: new Date(utcSeconds * 1000),
      high: chart.indicators.quote[0].high[i],
      close: chart.indicators.quote[0].close[i],
      open: chart.indicators.quote[0].open[i],
      low: chart.indicators.quote[0].low[i],
    }));
  }

  async getCharts(
    tickers: string[],
    period: PeriodEnum,
    apiKey?: string,
  ): Promise<ChartModel[]> {
    try {
      const tickersComparison = tickers.slice(1);
      const options = this.getOptions(tickers[0], period, apiKey);
      options.params.comparisons = tickersComparison.join(',');

      const response = (await axios.request<ChartYahooDTO>(options)).data.chart
        .result[0];

      const result = [
        {
          ticker: tickers[0],
          chart: this.parseChart(response),
        },
      ];

      const mapChart = new Map(
        response.comparisons.map((comparison) => [
          comparison.symbol,
          { ...comparison },
        ]),
      );

      tickersComparison.forEach((ticker) => {
        const chartYahoo = mapChart.get(ticker);

        let chart = [];
        if (chartYahoo) {
          chart = response.timestamp.map((utcSeconds, i) => ({
            date: new Date(utcSeconds * 1000),
            high: chartYahoo.high[i],
            close: chartYahoo.close[i],
            open: chartYahoo.open[i],
            low: chartYahoo.low[i],
          }));
        }

        result.push({
          ticker,
          chart,
        });
      });

      return result;
    } catch (error) {
      if (error instanceof AxiosError && apiKey == undefined) {
        return this.getCharts(tickers, period, process.env.API_KEY_RAPID_2);
      }

      Logger.error('Erro ao localizar os gráficos', error);

      return tickers.map((e) => ({ ticker: e, chart: [] }));
    }
  }
}
