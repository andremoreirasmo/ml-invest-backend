export interface ChartYahooDTO {
  chart: Chart;
}

export interface Chart {
  result: Result[];
  error: any;
}

export interface Result {
  timestamp: number[];
  indicators: Indicators;
  comparisons: Comparison[];
}

export interface Indicators {
  quote: Quote[];
  adjclose: Adjclose[];
}

export interface Comparison {
  symbol: string;
  high: number[];
  low: number[];
  close: number[];
  open: number[];
}

export interface Quote {
  close: number[];
  open: number[];
  low: number[];
  volume: number[];
  high: number[];
}

export interface Adjclose {
  adjclose: number[];
}
