import { add, startOfDay } from 'date-fns';

export type IntervalType =
  | '1m'
  | '2m'
  | '5m'
  | '15m'
  | '30m'
  | '60m'
  | '90m'
  | '1h'
  | '1d'
  | '5d'
  | '1wk'
  | '1mo'
  | '3mo';

export enum PeriodEnum {
  OneDay,
  OneWeek,
  OneMonth,
  OneYear,
  FiveYears,
  Max,
}

export type keyofPeriodEnum = keyof typeof PeriodEnum;

export class PeriodUtil {
  static getInterval(e: PeriodEnum): IntervalType {
    switch (e) {
      case PeriodEnum.OneDay:
        return '30m';

      case PeriodEnum.OneWeek:
        return '5d';

      case PeriodEnum.OneMonth:
        return '1d';

      case PeriodEnum.OneYear:
        return '3mo';

      case PeriodEnum.FiveYears:
      case PeriodEnum.Max:
        return '3mo';

      default:
        return '1h';
    }
  }

  static getPeriod(e: PeriodEnum): Date {
    switch (e) {
      case PeriodEnum.OneDay:
        return startOfDay(new Date());

      case PeriodEnum.OneWeek:
        return add(new Date(), { days: -7 });

      case PeriodEnum.OneMonth:
        return add(new Date(), { months: -1 });

      case PeriodEnum.OneYear:
        return add(new Date(), { years: -1 });

      case PeriodEnum.FiveYears:
        return add(new Date(), { years: -5 });

      case PeriodEnum.Max:
        return add(new Date(), { years: -999 });

      default:
        return new Date();
    }
  }
}
