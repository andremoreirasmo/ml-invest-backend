export interface ChartModel {
  ticker: string;
  chart: ChartQuotes[];
}

export interface ChartQuotes {
  date: Date;
  high: number;
  low: number;
  close: number;
  open: number;
}
