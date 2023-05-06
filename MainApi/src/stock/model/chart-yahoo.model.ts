export interface ChartYahooRoot {
  chart: Chart;
}

export interface Chart {
  result: Result[];
  error: any;
}

export interface Result {
  timestamp: number[];
  indicators: Indicators;
}

export interface Indicators {
  quote: Quote[];
  adjclose: Adjclose[];
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
